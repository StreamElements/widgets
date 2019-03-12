let index, goal, fieldData, currency, userLocale;

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    goal = fieldData["goal"];
    userLocale = fieldData["userLocale"];
    currency = obj["detail"]["currency"]["code"];
    index = fieldData['eventType'] + "-" + fieldData['eventPeriod'];
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
    if (fieldData['eventType'] === 'tip') {
        $("#goal").html(goal.toLocaleString(userLocale, {style: 'currency', currency: currency}));
    } else {
        $("#goal").html(goal);
    }
    updateBar(count);
});

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

function updateBar(count) {
    let percentage = Math.min(100, (count / goal * 100).toPrecision(3));
    $("#bar").css('width', percentage + "%");
    if (fieldData['eventType'] === 'tip') {
        count = count.toLocaleString(userLocale, {style: 'currency', currency: currency})
    }
    $("#count").html(count);

}