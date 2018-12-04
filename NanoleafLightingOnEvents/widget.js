let fieldData, url;

//List of redeemable items names and effects for them - th
// For example, if your item is named "Disco Lights", add "DiscoLights":
// "DiscoLights": {
//      "effect": "Nemo",
//      "time": 2,
// },
let items = {
    "SETshirt": {
        "effect": "Nemo",
        "time": 2,
    },
    "ItemNameWihtoutSpaces": {
        "effect": "Nemo",
        "time": 2,
    },
};

window.addEventListener('onEventReceived', function (obj) {

    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    if (typeof obj.detail.listener === "undefined") return;
    const listener = obj.detail.listener.split("-");
    if (typeof listener === "undefined") return;
    if (listener[1] !== "latest") return;
    let item;
    if (listener[0] === "redemption") {
        item = obj.detail.event.item;
        item = item.replace(/\W/g, '');
    }
    light(listener[0], item);
});
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    url = 'http://' + fieldData['ip'] + '/api/v1/' + fieldData['token'] + '/effects'; // your api url
});

function light(event, name = "") {
    let effect = "", time;
    if (event === "redemption") {
        if (typeof items[name] === "undefined") return;
        effect = items[name]["effect"];
        time = items[name]["time"];
    } else {
        effect = fieldData[event + "Effect"];
        time = fieldData[event + "Time"];
    }

    if (effect === "") return;

    $.ajax({
        url: url,
        method: 'PUT',
        data: JSON.stringify({"select": effect}),
        processData: false,
        contentType: 'application/json',
        success: function () {
            setTimeout(function () {
                $.ajax({
                    url: url,
                    method: 'PUT',
                    processData: false,
                    contentType: 'application/json',
                    data: JSON.stringify({"select": fieldData["defaultEffect"]}),
                });
            }, time * 1000);
        }
    });
}

