let goal, fieldData;
let pointsPerTip = 1;
let pointsPerBit = 0.01;
let pointsPerSub = 3;
let pointsPerFollow = 0;

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    goal = fieldData["goal"];
    pointsPerBit = fieldData["pointsPerBit"];
    pointsPerTip = fieldData["pointsPerTip"];
    pointsPerSub = fieldData["pointsPerSub"];
    let data = obj["detail"]["session"]["data"];
    analysePoints(data);
});

window.addEventListener('onSessionUpdate', function (obj) {
    let data = obj["detail"]["session"];
    analysePoints(data);
});

function analysePoints(data) {
    let bitsAmount = data["cheer-goal"]["amount"];
    let subsAmount = data["subscriber-goal"]["amount"];
    let tipsAmount = data["tip-goal"]["amount"];
    let followerAmount = data["follower-goal"]["amount"];
    let currentPoints = subsAmount * pointsPerSub;
    currentPoints += tipsAmount * pointsPerTip;
    currentPoints += bitsAmount * pointsPerBit;
    currentPoints += followerAmount * pointsPerFollow;
    updateBar(currentPoints);
}

function updateBar(amount) {
    let percentage = amount / goal * 100;
    $("#bar").css('width', Math.min(100, percentage) + "%");
    $("#percent").html(parseFloat(percentage).toFixed(2));
}