//MULTIPLIERS:
let fieldData;

let maxTime = new Date(); // Time cap you want to use
let minTime = new Date();
let addOnZero = false;
let stopOnZero = false;
let endTime;
let pauseTime; // If non-nil, the Date that the timer was paused.

function logState(label) {
    console.log(`${label}: pause:${pauseTime}, end:${endTime}`);
}

function countdown(seconds) {
    logState('countdown');
    // if (seconds == 0) return;
    let toCountDown = endTime;
    let basisTime = pauseTime || new Date();
    if (stopOnZero && toCountDown < basisTime) {
        console.log(`countdown returning at zero`);
        return;
    }
    if (addOnZero) {
        let a = [toCountDown, basisTime];
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
    toCountDown = new Date(a[0].getTime());
    endTime = toCountDown;
    if (pauseTime) {
        recalculateEndTime();
    }
    logState('continuing countdown');
    $('#countdown').countdown(toCountDown, function (event) {
        if (event.type === "finish") $(this).html(fieldData.onComplete);
        else $(this).html(event.strftime('%I:%M:%S'));
    });
    if (pauseTime) {
        console.log(`countdown pausing`);
        let cd = $('#countdown');

        // Stop the counter
        cd.countdown('pause');
    }

    saveState();

}

function pauseTimer() {
    logState('pause');
    if (pauseTime) return;
    pauseTime = new Date();
    countdown(0);
}

function recalculateEndTime() {
    if (!pauseTime) return;
    logState('before recalc');
    let now = new Date();
    let timePaused = Math.max(0, now.getTime() - pauseTime.getTime());
    endTime.setMilliseconds( endTime.getMilliseconds() + timePaused);
    pauseTime = now;
    logState('after  recalc');
}

function resumeTimer() {
    logState('resumeTimer');
    if (!pauseTime) return;
    recalculateEndTime();
    pauseTime = null;
    countdown(0);
    $('#countdown').countdown('resume');
}

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    // Handling chat message
    if (listener === 'message') {
        console.log(obj.detail.event);
        const {text, nick, tags, channel} = obj.detail.event.data;
        const userstate = {
            'mod': parseInt(tags.mod),
            'sub': parseInt(tags.subscriber),
            'vip': (tags.badges.indexOf("vip") !== -1),
            'badges': {
                'broadcaster': (nick === channel),
            }
        };
        // Verify chat command permissions
        if (!(userstate.mod && fieldData['managePermissions'] === 'mods' || userstate.badges.broadcaster || fieldData.additionalUsers.includes(nick.toLowerCase()))) return;
        
        if (text.startsWith(fieldData.addTimeCommand)) {
            const seconds = parseFloat(text.split(' ')[1]) * 60;
            if (isNaN(seconds)) return;
            countdown(seconds);
        }
        if (text.startsWith(fieldData.pauseCommand)) {
            pauseTimer();
        }
        if (text.startsWith(fieldData.resumeCommand)) {
            resumeTimer();
        }
        return;
    }
    // Handling widget buttons
    if (obj.detail.event) {
        if (obj.detail.event.listener === 'widget-button') {
            if (obj.detail.event.field === 'resetTimer') {
                pauseTime = null;
                minTime = new Date();
                minTime.setMinutes(minTime.getMinutes() + fieldData.minTime);
                maxTime = new Date();
                maxTime.setMinutes(maxTime.getMinutes() + fieldData.maxTime);
                endTime = minTime;
                logState('reset');
                countdown(1);
            }
            if (obj.detail.event.field === 'addTime') {
                countdown(60);
            }
            if (obj.detail.event.field === 'pause') {
                pauseTimer();
            }
            if (obj.detail.event.field === 'resume') {
                resumeTimer();
            }
            return;
        }
    } else if (listener.indexOf("-latest") === -1) return;

    const data = obj.detail.event;
    if (listener === 'follower-latest') {
        if (fieldData.followSeconds !== 0) countdown(fieldData.followSeconds);
    } else if (listener === 'subscriber-latest') {
        if (data.bulkGifted) { // Ignore gifting event and count only real subs
            return;
        }
        if (parseInt(data.tier) === 2000) {
            if (fieldData.sub2Seconds !== 0) countdown(fieldData.sub2Seconds);
        } else if (parseInt(data.tier) === 3000) {
            if (fieldData.sub3Seconds !== 0) countdown(fieldData.sub3Seconds);
        } else {
            if (fieldData.sub1Seconds !== 0) countdown(fieldData.sub1Seconds);
        }

    } else if (listener === 'host-latest') {
        if (data['amount'] < fieldData.hostMin || fieldData.hostSeconds === 0) {
            return;
        }
        countdown(fieldData.hostSeconds * data["amount"]);
    } else if (listener === 'raid-latest') {
        if (data['amount'] < fieldData.raidMin || fieldData.raidSeconds === 0) {
            return;
        }
        countdown(fieldData.raidSeconds * data["amount"]);
    } else if (listener === 'cheer-latest') {
        if (data['amount'] < fieldData.cheerMin || fieldData.cheerSeconds === 0) {
            return;
        }
        countdown(parseInt(fieldData.cheerSeconds * data["amount"] / 100));
    } else if (listener === 'tip-latest') {
        if (data['amount'] < fieldData.tipMin || fieldData.tipSeconds === 0) {
            return;
        }
        countdown(parseInt(fieldData.tipSeconds * data["amount"]));
    } else if (listener === 'merch-latest') {
        if (fieldData.merchSeconds === 0) {
            return;
        }
        countdown(parseInt(fieldData.merchSeconds * data["amount"]));
    }


});
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    addOnZero = (fieldData.addOnZero === "add");
    stopOnZero = (fieldData.addOnZero === "stop");
    fieldData.additionalUsers = fieldData.additionalUsers.toLowerCase().split(',').map(el => el.trim());
    loadState();
});


function saveState() {
    logState('saving');
    let state = {current: endTime, maxTime: maxTime, minTime: minTime, pauseTime: pauseTime};
    SE_API.store.set('marathon', state);
}

function loadState() {
    SE_API.store.get('marathon').then(obj => {
        if (obj !== null) {
            let current = new Date();
            if (fieldData.preserveTime === "save") {
                current = new Date(obj.current);
                console.log(`save current = ${current}`);
                minTime = new Date(obj.minTime);
                maxTime = new Date(obj.maxTime);
                endTime = new Date(current);
                if (obj.pauseTime) {
                    pauseTime = new Date(obj.pauseTime);
                    recalculateEndTime();
                } else {
                    pauseTime = null;
                }
                logState('loaded');
            } else if (fieldData.preserveTime === "restart") {
                pauseTime = null;
                minTime = new Date();
                current = minTime;
                minTime.setMinutes(minTime.getMinutes() + fieldData.minTime);
                maxTime = new Date();
                maxTime.setMinutes(maxTime.getMinutes() + fieldData.maxTime);
                endTime = minTime;
            }

            // Make sure the end time is at least after the minimum time.
            if (current > 0) {
                console.log(`oldCurrent = ${current}`);
                current = Math.max(current, minTime);
                endTime = new Date(current);
                logState('mintime');
                countdown(1);
            } else {
                endTime = minTime;
                countdown(0);
            }
        } else {
            endTime = minTime;
            countdown(0);
        }
    });
}
