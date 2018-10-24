var userOptions = {
    channelName: "leeeeex",
    sounds: {
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
    }
};


let clientOptions = {
    connection: {
        reconnect: true,
        secure: true,
    },
    channels: [userOptions.channelName]
};

let queue = $("#placeholder");
let emoticons = [];
const client = new TwitchJS.client(clientOptions);
client.on('message', function (channel, userstate, message) {
    let words = message.split(" ");
    let results = words.filter(value => -1 !== emoticons.indexOf(value));
    results = Array.from(new Set(results)); //getting unique emoticons
    for (let i in results) {
        checkPlay(results[i]);
    }

});

function checkPlay(index) {
    let sound = userOptions['sounds'][index];
    if (sound.cooldownEnd < Date.now() / 1000) {
        userOptions['sounds'][index]['counter']++;
        if (userOptions['sounds'][index]['timer'] === 0) {
            userOptions['sounds'][index]['timer'] = userOptions['sounds'][index]['timeout'];
        }
        if (userOptions['sounds'][index]['counter'] >= userOptions['sounds'][index]['amount']) {
            userOptions['sounds'][index]['cooldownEnd'] = (Date.now() / 1000) + sound.cooldown;
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

client.connect();
for (let key in userOptions.sounds) {
    emoticons.push(key);
    userOptions['sounds'][key]['counter'] = 0;
    userOptions['sounds'][key]['cooldownEnd'] = 0;
    userOptions['sounds'][key]['timer'] = 0;
}

var t = setInterval(function () {
    for (let key in userOptions.sounds) {
        userOptions['sounds'][key]['timer'] = Math.max((userOptions['sounds'][key]['timer'] - 1), 0);
        if (userOptions['sounds'][key]['timer'] === 0) {
            userOptions['sounds'][key]['counter'] = 0;
        }
    }
}, 1000);
