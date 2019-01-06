let sounds = {
    PogChamp: {
        amount: 20,
        soundFile: "https://d1490khl9dq1ow.cloudfront.net/sfx/mp3preview/casino-slot-machine_GJaIAh4d.mp3",
        volume: 50,
        timeout: 10, //seconds
        cooldown: 240, //seconds
    },
    Kappa: {
        amount: 2,
        soundFile: "https://d1490khl9dq1ow.cloudfront.net/sfx/mp3preview/casino-slot-machine_GJaIAh4d.mp3",
        volume: 50,
        timeout: 10, //seconds
        cooldown: 240, //seconds
    },
    PJSalt: {
        amount: 2,
        soundFile: "https://d1490khl9dq1ow.cloudfront.net/sfx/mp3preview/casino-slot-machine_GJaIAh4d.mp3",
        volume: 50,
        timeout: 3, //seconds
        cooldown: 240, //seconds
    },
};


let queue = $("#placeholder");
let emoticons = [];
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let message = data["text"];
    let words = message.split(" ");
    let results = words.filter(value => -1 !== emoticons.indexOf(value));
    results = Array.from(new Set(results)); //getting unique emoticons
    for (let i in results) {
        checkPlay(results[i]);
    }

});

function checkPlay(index) {
    let sound = sounds[index];
    if (sound.cooldownEnd < Date.now() / 1000) {
        sounds[index]['counter']++;
        if (sounds[index]['timer'] === 0) {
            sounds[index]['timer'] = sounds[index]['timeout'];
        }
        if (sounds[index]['counter'] >= sounds[index]['amount']) {
            sounds[index]['cooldownEnd'] = (Date.now() / 1000) + sound.cooldown;
            queue
                .queue(function () {

                    let audio = new Audio(sound.soundFile);
                    audio.volume = sound.volume * .01;
                    audio.play();
                })
                .delay(audio.duration * 1000);
        }
    }
}

for (let key in sounds) {
    emoticons.push(key);
    sounds[key]['counter'] = 0;
    sounds[key]['cooldownEnd'] = 0;
    sounds[key]['timer'] = 0;
}

let t = setInterval(function () {
    for (let key in sounds) {
        sounds[key]['timer'] = Math.max((sounds[key]['timer'] - 1), 0);
        if (sounds[key]['timer'] === 0) {
            sounds[key]['counter'] = 0;
        }
    }
}, 1000);
