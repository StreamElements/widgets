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
    subSeconds = 10,
    cheerSeconds = 1, //multiplied by amount of cheer
    donationSeconds = 60, //multiplied by amount of donation, for example [CURRENCY] 3 will add 3 minutes
    hostSeconds = 1; //multiplied by amount of viewers from host


let minutes = 20; //initial timer script will go off
let maxTime = '2019-06-18 10:45'; // Time cap you want to use


//Starting to work like a machine does
let seconds = minutes * 60;
maxTime = new Date(maxTime);
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
            countdown(subSeconds);
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
    if (keyXYZ) {
        loadState();
    } else {
        $.post("https://api.keyvalue.xyz/new/SEMarathon", function (data) {
            let parts = data.slice(1, -1).split("/");
            $("#countdown").html('SET keyXYZ value in your JS tab to "' + parts[3] + '"');
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
            start = new Date(amount);
            countdown(0);

        } else {
            start = new Date();
            countdown(seconds);
        }


    });
}
