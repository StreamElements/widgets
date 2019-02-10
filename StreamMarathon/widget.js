//MULTIPLIERS:
let followSeconds = 1,
    sub1Seconds = 10,
    sub2Seconds = 20,
    sub3Seconds = 30,
    cheerSeconds = 60, //multiplied by every 100 amount of cheer
    minCheer = 100, // minimum value of cheer
    tipSeconds = 60, //multiplied by amount of tip, for example [CURRENCY] 3 will add 3 minutes
    minTip = 1, //minimum amount of tip
    hostSeconds = 1, //multiplied by amount of viewers from host
    hostMin = 100,//minimum viewers in host
    raidSeconds = 1,//multiplied by amount of viewers from raid
    raidMin = 100; // minimum viewers in raid

let maxTime = '2040-06-18 10:45'; // Time cap you want to use
let minTime = '2019-01-29 12:00';


//Starting to work like a machine does

let start;

function countdown(seconds) {
    //$("#countdown").countdown('destroy');

    let toCountDown = start;
    toCountDown.setSeconds(toCountDown.getSeconds()+seconds);

    let a = [toCountDown, maxTime];
    a.sort(function (a, b) {
        return Date.parse(a) - Date.parse(b);
    });
    toCountDown = a[0];
    start = toCountDown;
    $('#countdown').countdown(toCountDown, function (event) {
        $(this).html(event.strftime('%H:%M:%S'));
    });
}

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    if (listener.indexOf("-latest") === -1) return;

    const data = obj.detail.event;
    if (listener === 'follower-latest') {
        if (followSeconds > 0) countdown(followSeconds);
    } else if (listener === 'subscriber-latest') {
        if (parseInt(data.tier) === 2000) {
            if (sub2Seconds > 0) countdown(sub2Seconds);
        } else if (parseInt(data.tier) === 3000) {
            if (sub3Seconds > 0) countdown(sub3Seconds);
        } else {
            if (sub1Seconds > 0) countdown(sub1Seconds);
        }

    } else if (listener === 'host-latest') {
        if (data['amount'] < hostMin || hostSeconds < 0) {
            return;
        }
        countdown(hostSeconds * data["amount"]);
    } else if (listener === 'raid-latest') {
        if (data['amount'] < raidMin || raidSeconds < 0) {
            return;
        }
        countdown(raidSeconds * data["amount"]);
    } else if (listener === 'cheer-latest') {
        if (data['amount'] < minCheer || cheerSeconds < 0) {
            return;
        }
        countdown(parseInt(cheerSeconds * data["amount"] / 100));
    } else if (listener === 'tip-latest') {
        if (data['amount'] < minTip || tipSeconds < 0) {
            return;
        }
        countdown(parseInt(tipSeconds * data["amount"]));
    }
    saveState();

});
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;

    followSeconds = fieldData.followSeconds;
    sub1Seconds = fieldData.sub1Seconds;
    sub2Seconds = fieldData.sub2Seconds;
    sub3Seconds = fieldData.sub3Seconds;
    cheerSeconds = fieldData.cheerSeconds; //multiplied by amount of cheer
    tipSeconds = fieldData.tipSeconds; //multiplied by amount of tip, for example [CURRENCY] 3 will add 3 minutes
    hostSeconds = fieldData.hostSeconds;
    hostMin = fieldData.hostMin;
    raidMin = fieldData.raidMin;
    maxTime = new Date(fieldData.maxTime);
    minTime = new Date(fieldData.minTime);

    loadState();

});


function saveState() {
    SE_API.store.set('marathon', {amount: start});
}

function loadState() {
    SE_API.store.get('marathon').then(obj => {
        let amount = new Date(obj.amount);
        if (amount > 0) {
            amount = Math.max(amount, minTime);
            start = new Date(amount);
            countdown(0);
        } else {
            start = minTime;
            countdown(0);
        }
    });
}