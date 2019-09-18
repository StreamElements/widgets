let index, fieldData, currency, userLocale, isPlaying;

let steps = [];

playAlert = (amount=0) => {

    /*
    Alertbox JS code should be pasted within playAlert function

    */

//get data from the 🤟 StreamElements 🤟 data injection
    const name = '';
    const animation = 'wobble';
    amount=amount.toString();

// vanilla es6 query selection (can use libraries and frameworks too)
    const userNameContainer = document.querySelector('#username-container');
    const amountContainer = document.querySelector('#amount-container');

// change the inner html to animate it 🤪
    userNameContainer.innerHTML = stringToAnimatedHTML(name, animation);
    amountContainer.innerHTML = stringToAnimatedHTML(amount, animation);

    /**
     * return an html, with animation
     * @param s: the text
     * @param anim: the animation to use on the text
     * @returns {string}
     */
    function stringToAnimatedHTML(s, anim) {
        let stringAsArray = s.split('');
        stringAsArray = stringAsArray.map((letter) => {
            return `<span class="animated-letter ${anim}">${letter}</span>`
        });
        return stringAsArray.join('');

    }
}


let audio = new Audio('{audio}');


window.addEventListener('onWidgetLoad', async function (obj) {
        fieldData = obj.detail.fieldData;
        userLocale = fieldData["userLocale"];
        currency = obj["detail"]["currency"]["code"];
        index = fieldData['eventType'] + "-" + fieldData['eventPeriod'];
        audio.volume=(fieldData.audioVolume/100);
        if (fieldData['eventType'] === "subscriber-points") {
            index = fieldData['eventType'];
        }
        count = 0;
        if (typeof obj["detail"]["session"]["data"][index] !== 'undefined') {
            if (fieldData['eventPeriod'] === 'goal' || fieldData['eventType'] === 'cheer' || fieldData['eventType'] === 'tip' || fieldData['eventType'] === 'subscriber-points') {
                count = obj["detail"]["session"]["data"][index]['amount'];
            } else {
                count = obj["detail"]["session"]["data"][index]['count'];
            }
        }
        let tmpsteps = fieldData.steps.split(",");
        tmpsteps.sort();
        if (fieldData['botCounter']) {
            count = await getCounterValue(obj.detail.channel.apiToken);
        }

        for (let i in tmpsteps) {
            amount = parseInt(tmpsteps[i]);
            steps.push(
                {
                    "amount": amount,
                    "played": amount <= count
                }
            );

        }

    }
);

let getCounterValue = apiKey => {
    return new Promise(resolve => {
        fetch("https://api.streamelements.com/kappa/v2/channels/me", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "authorization": `apikey ${apiKey}`
            }, "method": "GET"
        }).then(response => response.json()).then(obj => {
            fetch(`https://api.streamelements.com/kappa/v2/bot/${obj._id}/counters/${fieldData.botCounterName}`).then(response => response.json()).then(data => {
                resolve(data.value)
            })
        });
    })
};

window.addEventListener('onSessionUpdate', function (obj) {
    if (typeof obj["detail"]["session"][index] !== 'undefined') {
        if (fieldData['eventPeriod'] === 'goal' || fieldData['eventType'] === 'cheer' || fieldData['eventType'] === 'tip' || fieldData['eventType'] === 'subscriber-points') {
            count = obj["detail"]["session"][index]['amount'];
        } else {
            count = obj["detail"]["session"][index]['count'];
        }
    }
    if (!isPlaying) {
        updateBar(count);
    }
});

window.addEventListener('onEventReceived', function (obj) {
    if (!fieldData['botCounter']) return;
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === 'bot:counter' && data.counter === fieldData['botCounterName']) {
        count = data.value;
        if (!isPlaying) {
            updateBar(count);
        }
    }
});

function updateBar(count) {
    let toPlay = 0;
    for (let i in steps) {
        if (steps[i]['amount'] <= count && !steps[i]['played']) {
            steps[i]['played'] = true;
            toPlay = steps[i]['amount'];
        } else if (steps[i]['amount'] > count) {
            steps[i]['played'] = false;
        }
    }
    if (toPlay) {
        audio.play();
        isPlaying = true;

        let row = $(template("alert", {amount: toPlay}));

        $("body").append(row);


        playAlert(toPlay);
        setTimeout(() => {
            let save = $("#alert").detach();
            $("body").html(save);
            isPlaying = false;
        }, fieldData.alertDuration * 1000);
    }
}

function template(templateId, data) {
    return document.getElementById(templateId).innerHTML
        .replace(
            /{(\w*)}/g,
            function (m, key) {
                return data.hasOwnProperty(key) ? data[key] : "";
            }
        );
}

