let userCurrency, userLocale, eventType, showName = false, fieldData;
let height;
let resize = () => {
    if ("{{dynamicFontSize}}" === "dynamic") {
        setTimeout(() => {
            fitty('.main-container', {
                minSize: 12,
                maxSize: height
            });
        }, 5);
    }
};

window.addEventListener('onSessionUpdate', function (obj) {
    const data = obj.detail.session;
    updateEvent(data);
    resize();
});

let updateEvent = (data) => {
    if (showName) {
        if (typeof data[eventType] === undefined) return;
        if (!data[eventType]["name"].length) return;
        if (eventType.indexOf("tip") !== -1) {
            $(".main-container").html(data[eventType]["name"] + " " + data[eventType]["amount"].toLocaleString(userLocale, {
                style: 'currency',
                currency: userCurrency
            }));
        } else if (eventType.indexOf("sub") !== -1 || eventType.indexOf("cheer") !== -1) {
            $(".main-container").html(data[eventType]["name"] + " X" + data[eventType]["amount"]).toLocaleString(userLocale);
        } else if (eventType.indexOf("raid") !== -1 || eventType.indexOf("host") !== -1) {
            $(".main-container").html(data[eventType]["name"] + " X" + data[eventType]["amount"]).toLocaleString(userLocale);
        } else {
            $(".main-container").html(data[eventType]["name"]);
        }
    } else {
        let count = 0;
        if (typeof data[eventType] !== 'undefined') {
            if (fieldData['eventPeriod'] === 'goal' || fieldData['eventType'] === 'cheer' || fieldData['eventType'] === 'tip' || fieldData['eventType'] === 'subscriber-points') {
                count = data[eventType]['amount'];
            } else {
                count = data[eventType]['count'];
            }
        }
        if (fieldData['eventType'] === 'tip') {
            $(".main-container").html(count.toLocaleString(userLocale, {style: 'currency', currency: userCurrency}));
        } else {
            $(".main-container").html(count.toLocaleString(userLocale));
        }
    }
};

window.addEventListener('onWidgetLoad', function (obj) {
    const data = obj.detail.session.data;
    userCurrency = obj.detail.currency.code;
    fieldData = obj.detail.fieldData;
    eventType = fieldData['eventType'] + "-" + fieldData['eventPeriod'];
    if (fieldData['eventType'].indexOf("-") !== -1) {
        if (fieldData['eventType'] !== "subscriber-points") {
            showName = true;
        }
        eventType = fieldData['eventType'];

    }
    userLocale = fieldData["locale"];
    height = $(".holder").height();
    updateEvent(data);
    resize();
    let duplicate=true;
    $('.marquee').marquee({
        //duration in milliseconds of the marquee
        speed: fieldData.marqueeSpeed,
        //gap in pixels between the tickers
        gap: fieldData.gap,
        //time in milliseconds before the marquee will start animating
        delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'left',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: duplicate
    });
    $(".plainh").remove();
});

