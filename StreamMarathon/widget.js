/*
ReadMe:
1) create Custom Event list within your layer on StreamElements
2) replace content of each section with code provided below
3) Click done
4) There will be keyXYZ displayed within widget, 
5) go to CSS Editor again and replace it in JS tab, 
6) Change multipliers to fit your needs, 
*/

let keyXYZ = ""; //it should look like let keyXYZ="1234abcd"; after first run

//MULTIPLIERS:
let followSeconds = 1,
    sub1Seconds = 10,
    sub2Seconds = 20,
    sub3Seconds = 30,
    cheerSeconds = 1, //multiplied by amount of cheer
    donationSeconds = 60, //multiplied by amount of donation, for example [CURRENCY] 3 will add 3 minutes
    hostSeconds = 1; //multiplied by amount of viewers from host

let maxTime = '2019-06-18 10:45'; // Time cap you want to use


//Starting to work like a machine does
let seconds;

let start;

function countdown(seconds) {
    //$("#countdown").countdown('destroy');
    let toCountDown = new Date(start.getTime() + seconds * 1000);
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
    if (keyXYZ) {
        const listener = obj.detail.listener;
        const data = obj.detail.event;
        if (listener === 'follower-latest') {
            countdown(followSeconds);
        } else if (listener === 'subscriber-latest') {
            if (data.tier === 2000) {
                countdown(sub2Seconds);
            } else if (data.tier === 3000) {
                countdown(sub3Seconds);
            } else {
                countdown(sub1Seconds);
            }

        } else if (listener === 'host-latest') {
            countdown(hostSeconds * data["amount"]);
        } else if (listener === 'cheer-latest') {
            countdown(cheerSeconds * data["amount"]);
        } else if (listener === 'tip-latest') {
            countdown(donationSeconds * data["amount"]);
        }
        saveState();
    }
});
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    keyXYZ = fieldData.keyXYZ;
    followSeconds = fieldData.followSeconds;
    sub1Seconds = fieldData.sub1Seconds;
    sub2Seconds = fieldData.sub2Seconds;
    sub3Seconds = fieldData.sub3Seconds;
    cheerSeconds = fieldData.cheerSeconds; //multiplied by amount of cheer
    donationSeconds = fieldData.donationSeconds; //multiplied by amount of donation, for example [CURRENCY] 3 will add 3 minutes
    hostSeconds = fieldData.hostSeconds;
    seconds = fieldData.initialMinutes * 60;
    maxTime = new Date(fieldData.maxTime);
    if (keyXYZ) {
        loadState();
    } else {
        $.post("https://api.keyvalue.xyz/new/SEMarathon", function (data) {
            let parts = data.slice(1, -1).split("/");
            $("#countdown").html('SET keyXYZ value in your config to "' + parts[3] + '"');
        });

    }
});


function saveState() {
    let value = Date.parse(start);
    $.post("https://api.keyvalue.xyz/" + keyXYZ + "/SEMarathon/" + value, function (data) {
    });
}

function loadState() {
    $.get("https://api.keyvalue.xyz/" + keyXYZ + "/SEMarathon", function (data) {


        let amount = parseInt(data);
        if (amount > 0) {
            amount = Math.max(amount, Date.now() - seconds * 1000);
            start = new Date(amount);
            countdown(0);

        } else {
            start = new Date();
            countdown(seconds);
        }


    });
}
