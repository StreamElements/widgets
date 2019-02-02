let elements = [
        {
            type: "tip-session-top-donator",
            icon: "fa-money-bill",
            message: "Top Tipper: {name} - ${amount}",
            emptyMessage: "No tips yet",
            factor: "amount", //if unset, 0 or empty string - display emptyMessage
        },
        {
            type: "cheer-session-top-donator",
            icon: "fa-gem",
            message: "Top cheerer: {name} - {amount} Bits",
            emptyMessage: "No cheers yet",
            factor: "amount",
        },
        {
            type: "subscriber-latest",
            icon: "fa-people",
            message: "Most recent sub: {name} (X{amount})",
            emptyMessage: "No subs yet",
            factor: "name",
        },
    ]
;


let userCurrency;
let userLocale = "en-US";
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let box;
let amount = 0;
let next = 0;
let timeIn = 400;
let timeDisplay = 2500;
let timeOut = 500;
let delay = 5000;
let timeBetween = 500;
let slideTime = timeIn + timeDisplay + timeOut + timeBetween;


function showSlide(i) {
    next++;
    $(box[i])
        .addClass(animationIn + ' animated', timeIn)
        .show(0, timeIn + timeOut)
        .removeClass(animationIn, timeDisplay)
        .addClass(animationOut, timeOut)
        .removeClass(animationOut + " animated", timeOut + 500)
        .hide(0, timeOut)
        .queue(function () {
            if (next >= amount) {
                next = 0;
                setTimeout(function () {
                    showSlide(next)
                }, delay);
            } else {
                showSlide(next)
            }
            $(this).dequeue();
        })
    ;

}

function parseData(data) {
    elements.forEach(function (element) {
        let text = "";
        if (typeof data[element.type][element.factor] === "undefined" || data[element.type][element.factor] === 0 || data[element.type][element.factor] === "") {
            text = element.emptyMessage;
        } else {
            text = element.message.replace(
                /{(\w*)}/g,
                function (m, key) {
                    return data[element.type].hasOwnProperty(key) ? data[element.type][key] : "";
                }
            );
        }
        $("#" + element.type).html(text);
    });
}

window.addEventListener('onSessionUpdate', e => {
    const data = e.detail.session;
    parseData(data);
});

window.addEventListener('onWidgetLoad', function (obj) {
    let data = obj["detail"]["session"]["data"];
    const fieldData = obj.detail.fieldData;
    animationIn = fieldData['animationIn'];
    animationOut = fieldData['animationOut'];
    timeIn = fieldData['timeIn'];
    timeDisplay = fieldData['timeDisplay'];
    timeOut = fieldData['timeOut'];
    delay = fieldData['delay'];
    timeBetween = fieldData['delay'];
    userCurrency = obj.detail.currency;

    slideTime = timeIn + timeDisplay + timeOut;
    let duplicateCheck = [];
    elements.forEach(function (element) {
        if (duplicateCheck.indexOf(element.type) === -1) {
            $(".container").append(`
    <div class="mySlides">
        <div class="icon">
            <span class="fa ${element.icon}"> </span>
        </div>
        <div class="username">
           <span id="${element.type}"></span>
        </div>
    </div>`);
            duplicateCheck.push(element.type);
        }

    });
    box = $(".mySlides");
    parseData(data);

    amount = box.length;
    showSlide(next);
});
