let index, goal, fieldData, currency;

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    goal = fieldData["goal"];
    currency = obj["detail"]["currency"]["symbol"];
    $("#goal").html(goal);
    index = fieldData['eventType'] + "-" + fieldData['eventPeriod'];
    count = 0;
    if (typeof obj["detail"]["session"]["data"][index] !== 'undefined') {
        if (fieldData['eventType'] === 'cheer' || fieldData['eventType'] === 'tip') {
            count = obj["detail"]["session"]["data"][index]['amount'];
        } else {
            count = obj["detail"]["session"]["data"][index]['count'];
        }
    }
    if (fieldData['eventType'] === 'tip') {
        $("#goal").prepend(currency);
    }
    updateBar(count);

});

window.addEventListener('onSessionUpdate', function (obj) {
    if (typeof obj["detail"]["session"][index] !== 'undefined') {
        if (fieldData['eventType'] === 'cheer' || fieldData['eventType'] === 'tip') {
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
    $("#count").html(count);
    if (fieldData['eventType'] === 'tip') {
        $("#count").prepend(currency);
    }
}