//MULTIPLIERS:
let fieldData;

let maxTime = '2040-06-18 10:45'; // Time cap you want to use
let minTime = '2019-01-29 12:00';
let addOnZero = false;

//Starting to work like a machine does

let start;

function countdown(seconds) {
    //$("#countdown").countdown('destroy');
    let toCountDown = start;
    if (addOnZero) {
        let a = [toCountDown, new Date()];
        a.sort(function (a, b) {
            return Date.parse(a) - Date.parse(b);
        });
        toCountDown = a[1];
    }

    toCountDown.setSeconds(toCountDown.getSeconds() + seconds);

    let a = [toCountDown, maxTime];
    a.sort(function (a, b) {
        return Date.parse(a) - Date.parse(b);
    });
    toCountDown = a[0];
    start = toCountDown;
    $('#countdown').countdown(toCountDown, function (event) {
        $(this).html(event.strftime('%I:%M:%S'));
    });
}

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    if (listener.indexOf("-latest") === -1) return;

    const data = obj.detail.event;
    if (listener === 'follower-latest') {
        if (followSeconds > 0) countdown(followSeconds);
    } else if (listener === 'subscriber-latest') {
        if (data.bulkGifted) { // Ignore gifting event and count only real subs
            return;
        }
        if (parseInt(data.tier) === 2000) {
            if (fieldData.sub2Seconds > 0) countdown(fieldData.sub2Seconds);
        } else if (parseInt(data.tier) === 3000) {
            if (fieldData.sub3Seconds > 0) countdown(fieldData.sub3Seconds);
        } else {
            if (fieldData.sub1Seconds > 0) countdown(fieldData.sub1Seconds);
        }

    } else if (listener === 'host-latest') {
        if (data['amount'] < fieldData.hostMin || fieldData.hostSeconds < 0) {
            return;
        }
        countdown(fieldData.hostSeconds * data["amount"]);
    } else if (listener === 'raid-latest') {
        if (data['amount'] < fieldData.raidMin || fieldData.raidSeconds < 0) {
            return;
        }
        countdown(fieldData.raidSeconds * data["amount"]);
    } else if (listener === 'cheer-latest') {
        if (data['amount'] < fieldData.cheerMin || fieldData.cheerSeconds < 0) {
            return;
        }
        countdown(parseInt(fieldData.cheerSeconds * data["amount"] / 100));
    } else if (listener === 'tip-latest') {
        if (data['amount'] < fieldData.tipMin || fieldData.tipSeconds < 0) {
            return;
        }
        countdown(parseInt(fieldData.tipSeconds * data["amount"]));
    }
    saveState();

});
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;

    maxTime = new Date(fieldData.maxTime);
    minTime = new Date(fieldData.minTime);
    addOnZero = (fieldData.addOnZero === "add");
    if (fieldData.resetTimer) {
        SE_API.store.set('marathon', {amount: minTime});
    }
    loadState();

});


function saveState() {
    SE_API.store.set('marathon', {amount: start});
}

function loadState() {
    SE_API.store.get('marathon').then(obj => {
        if (obj !== null) {
            let amount = new Date(obj.amount);
            if (amount > 0) {
                amount = Math.max(amount, minTime);
                start = new Date(amount);
                countdown(0);
            } else {
                start = minTime;
                countdown(0);
            }
        } else {
            start = minTime;
            countdown(0);
        }
    });
}