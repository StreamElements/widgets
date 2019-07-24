let userCurrency, userLocale, eventType;
let height;
let resize = () => {
    console.log();
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
    if (!data[eventType]["name"].length) return;
    if (eventType.indexOf("tip") != -1) {
        $(".main-container").html(data[eventType]["name"] + " " + data[eventType]["amount"].toLocaleString(userLocale, {
            style: 'currency',
            currency: userCurrency
        }));
    } else if (eventType.indexOf("sub") != -1 || eventType.indexOf("cheer") != -1) {
        $(".main-container").html(data[eventType]["name"] + " X" + data[eventType]["amount"]);
    } else if (eventType.indexOf("raid") != -1 || eventType.indexOf("host") != -1) {
        $(".main-container").html(data[eventType]["name"] + " X" + data[eventType]["amount"]);
    } else {
        $(".main-container").html(data[eventType]["name"]);
    }

    resize();
});


window.addEventListener('onWidgetLoad', function (obj) {
    const data = obj.detail.session.data;
    userCurrency = obj.detail.currency.code;
    const fieldData = obj.detail.fieldData;
    eventType = fieldData["eventType"];
    userLocale = fieldData["locale"];
    height = $(".holder").height();
    if (!data[eventType]["name"].length) return;
    if (eventType.indexOf("tip") != -1) {
        $(".main-container").html(data[eventType]["name"] + " " + data[eventType]["amount"].toLocaleString(userLocale, {
            style: 'currency',
            currency: userCurrency
        }));
    } else if (eventType.indexOf("sub") != -1 || eventType.indexOf("cheer") != -1) {
        $(".main-container").html(data[eventType]["name"] + " X" + data[eventType]["amount"]);
    } else if (eventType.indexOf("raid") != -1 || eventType.indexOf("host") != -1) {
        $(".main-container").html(data[eventType]["name"] + " X" + data[eventType]["amount"]);
    } else {
        $(".main-container").html(data[eventType]["name"]);
    }
    resize();

});
