let index, goal, fieldData, currency, userLocale, prevCount, timeout, outputCurrency;

async function convertCurrency(amount) {
    if (outputCurrency === currency) return amount;
    let response = await fetch(`https://decapi.me/misc/currency?from=${currency}&to=${outputCurrency}&value=${amount}`);
    let data = await response.text();
    data = data.split(" = ")[1].replace(/[^0-9.]/g, "")
    return data;
}

function setGoal() {
    if (fieldData['eventType'] === 'tip') {
        console.log("Output currency: " + outputCurrency);
        if (goal % 1) {
            $("#goal").html(goal.toLocaleString(userLocale, {style: 'currency', currency: outputCurrency}));
        } else {
            $("#goal").html(goal.toLocaleString(userLocale, {
                minimumFractionDigits: 0,
                style: 'currency',
                currency: outputCurrency
            }));
        }
    } else {
        $("#goal").html(goal);
    }
}

window.addEventListener('onWidgetLoad', async function (obj) {
        fieldData = obj.detail.fieldData;
        goal = fieldData["goal"];
        userLocale = fieldData["userLocale"];
        currency = obj["detail"]["currency"]["code"];
        outputCurrency = fieldData.overrideCurrency === 'yes' ? fieldData.overrideCurrencyCode : currency;
        index = fieldData['eventType'] + "-" + fieldData['eventPeriod'];
        if (fieldData['eventType'] === "subscriber-points") {
            index = fieldData['eventType'];
        }
        let count = 0;
        if (typeof obj["detail"]["session"]["data"][index] !== 'undefined') {
            if (fieldData['eventPeriod'] === 'goal' || fieldData['eventType'] === 'cheer' || fieldData['eventType'] === 'tip' || fieldData['eventType'] === 'subscriber-points') {
                count = obj["detail"]["session"]["data"][index]['amount'];
            } else {
                count = obj["detail"]["session"]["data"][index]['count'];
            }
        }
        if (fieldData['botCounter']) {
            goal = await getCounterValue(obj.detail.channel.apiToken);
        }
        setGoal()
        updateBar(count);
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
                resolve(data.count)
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
    updateBar(count);
});

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === 'bot:counter' && data.counter === fieldData.botCounterName) {
        goal = data.value;
        setGoal();
        updateBar(prevCount, true);
    }
});


async function updateBar(count, force = false) {
    if (fieldData['eventType'] === 'tip') {
        count = await convertCurrency(count);
    }
    if (count === prevCount && !force) return;
    if (count >= goal) {
        if (fieldData['autoIncrement'] > 0 && fieldData.onGoalReach === "increment") {
            goal += fieldData['autoIncrement'];
            setGoal();
            updateBar(count);
            return;
        } else if (fieldData.onGoalReach === "reset") {
            fieldData.onGoalReach === "reset";
            count = count % goal;
        }
    }
    clearTimeout(timeout);
    prevCount = count;
    $("body").fadeTo("slow", 1);
    let percentage = Math.min(100, (count / goal * 100).toPrecision(3));
    $("#bar").css('width', percentage + "%");
    if (fieldData['eventType'] === 'tip') {
        if (count % 1) {
            count = count.toLocaleString(userLocale, {style: 'currency', currency: outputCurrency})
        } else {
            count = count.toLocaleString(userLocale, {minimumFractionDigits: 0, style: 'currency', currency: outputCurrency})
        }
    }
    $("#count").html(count);
    if (fieldData.fadeoutAfter) {
        timeout = setTimeout(() => {
            $("body").fadeTo("slow", 0);
        }, fieldData.fadeoutAfter * 1000)
    }

}
