let goal, fieldData;

let botPoints = 0;
let sessionData;

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    goal = fieldData["goal"];
    sessionData = obj["detail"]["session"]["data"];
    SE_API.counters.get(fieldData.botCounterName).then(counter => {
        botPoints = parseInt(counter.value);
        analysePoints();
    });
});

window.addEventListener('onSessionUpdate', function (obj) {
    sessionData = obj["detail"]["session"];
    analysePoints();
});

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;
    if (listener === 'bot:counter' && data.counter === fieldData.botCounterName) {
        botPoints = parseInt(data.value);
        analysePoints();
    }
});


function analysePoints() {
    let data = sessionData;
    let bitsAmount = data["cheer-goal"]["amount"];
    let subsAmount = data["subscriber-goal"]["amount"];
    let tipsAmount = data["tip-goal"]["amount"];
    let followerAmount = data["follower-goal"]["amount"];
    let currentPoints = subsAmount * fieldData.pointsPerSub;
    currentPoints += tipsAmount * fieldData.pointsPerTip;
    currentPoints += bitsAmount * fieldData.pointsPerBit;
    currentPoints += followerAmount * fieldData.pointsPerFollow;
    currentPoints += botPoints * fieldData.pointsPerCounter;
    updateBar(currentPoints);
}

function updateBar(amount) {
    let percentage = amount / goal * 100;
    $("#bar").css('width', Math.min(100, percentage) + "%");
    $("#percent").html(parseFloat(percentage).toFixed(2));
}
