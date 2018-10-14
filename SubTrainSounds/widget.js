let userConfig = {
    "type": "subscriber",
    "time": "1", //minutes
};

let sounds = {
    1: "https://cdn.streamelements.com/static/alertbox/default.ogg",
    2: "https://www.soundboard.com/mediafiles/23/230223-316b7374-651a-46f4-a1c2-b0da0c0a72f8.mp3",
    3: "https://www.soundboard.com/mediafiles/23/230223-316b7374-651a-46f4-a1c2-b0da0c0a72f8.mp3",
};

let amount = 0;
let timer = 0;
var audio = $("#audio");
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === userConfig.type + '-latest') {
        addToTrain(data["name"]);
    }
});

function addToTrain(username) {
    amount++;
    if (typeof sounds[amount] !== 'undefined') {
        audio[0].pause();
        $("#audioSource").attr("src", sounds[amount]);
        audio[0].load();
        audio[0].play();
    }

    $("#amount").html(amount);
    $("#user").html(`<span class="fa fa-user"></span> ${username}`);
    timer = userConfig.time * 60;

}

setInterval(
    function () {
        if (timer === 0) {
            $("#timer").html(toTime(timer));
            amount = 0;
            $("#amount").html(amount);
            $("#user").html("");
        }
        else {
            $("#timer").html(toTime(timer));
            timer--;
        }
    }, 1000
);

function toTime(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}