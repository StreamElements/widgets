let sessionData;
let prepareField = (field) => {

    if (typeof field.data("template") === "undefined") {
        field.data("template", field.text());
    }
    field.text(field.data('template').replace(/{([\w\.\-]*)}/g, function (m, key) {
        if (key.indexOf(".") === -1) return key;
        key = key.split(".");
        if (!sessionData.hasOwnProperty(key[0])) return '';
        let data = sessionData[key[0]];
        if (!data.hasOwnProperty(key[1])) return '';
        return data[key[1]];
    }));
};

window.addEventListener('onWidgetLoad', (obj) => {
    sessionData = obj.detail.session.data;
    $(".sessionData").each(function () {
        prepareField($(this));
    });
});

window.addEventListener('onSessionUpdate', (obj) => {
    sessionData = obj.detail.session;
    $(".sessionData").each(function () {
        prepareField($(this));
    });
});