let userCurrency, userLocale, eventType, showName = false, fieldData;
let height;
const resize = () => {
    if ("{{dynamicFontSize}}" === "dynamic") {
        setTimeout(() => {
            fitty('.main-container', {
                minSize: 12,
                maxSize: height
            });
        }, 5);
    }
};

window.addEventListener('onSessionUpdate', (obj) => {
    sessionData = obj.detail.session;
    $(".main-container").each(function (index) {
        prepareField($(this));
    });
    resize();
});

let prepareField = (field) => {
    if (typeof field === "undefined") return;
    if (typeof field.data("template") === "undefined") {
        field.data("template", field.html());
    }
    field.html(field.data('template').replace(/{([\w\.\-]*)}/g, function (m, key) {
        key = key.split(".");
        if (key[0] === "image") {
            const index = parseInt(key[1]) - 1;
            if (typeof fieldData['images'][index] !== "undefined") return `<img src="${fieldData['images'][index]}" class="image"/>`
        }
        if (!sessionData.hasOwnProperty(key[0])) return key.join(".");
        let data = sessionData[key[0]]
        if (!data.hasOwnProperty(key[1])) return key.join(".");
        return data[key[1]];
    }));

}

window.addEventListener('onWidgetLoad', function (obj) {
    height = $(".holder").height();
    sessionData = obj.detail.session.data;
    fieldData = obj.detail.fieldData;
    $(".main-container").each(function (index) {
        prepareField($(this));
    });

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
        duplicated: true
    });
    $(".plainh").remove();
    resize();
});
