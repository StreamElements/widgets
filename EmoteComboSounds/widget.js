// URLs in userConfig are not real, please replace them with your URLs for sounds/images
// Sound files are mandatory, image files are optional
let userConfig = [
    {
        emote: "OMEGALUL",
        amount: 3,
        soundFile: "https://cdn.streamelements.com/uploads/OMEGALUL.mp3",
        imageFile: "https://cdn.streamelements.com/uploads/OMEGALUL_ANIMATED.gif",
        volume: 50,
        timeout: 10, //seconds
        cooldown: 240, //seconds
    },
    {
        emote: "Kappa",
        amount: 2,
        soundFile: "https://cdn.streamelements.com/uploads/Kappa.ogg",
        imageFile: "",
        volume: 50,
        timeout: 10, //seconds
        cooldown: 240, //seconds
    }
];


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
        index = userConfig.findIndex(x => x.emote === results[i]);
        if (index !== -1) {
            checkPlay(index);
        }
    }

});

function checkPlay(index) {
    let sound = userConfig[index];


    if (sound.cooldownEnd < Date.now() / 1000) {
        userConfig[index]['counter']++;
        if (userConfig[index]['timer'] === 0) {
            userConfig[index]['timer'] = userConfig[index]['timeout'];
        }
        if (userConfig[index]['counter'] >= userConfig[index]['amount']) {
            userConfig[index]['cooldownEnd'] = (Date.now() / 1000) + sound.cooldown;
            let tmpaudio = new Audio(sound.soundFile);
            tmpaudio.onloadeddata = function () {
                console.log(`adding ${index} to queue after ${tmpaudio.duration}`);

                queue
                    .queue(function () {
                        let audio = new Audio(sound.soundFile);
                        audio.volume = sound.volume * .01;
                        audio.play();
                        if (sound.imageFile.length > 10) {
                            $("#image").css('background-image', 'url(' + sound.imageFile + ')');
                            setTimeout(function () {
                                $("#image").css('background-image', '');
                            }, tmpaudio.duration * 1000);
                        }
                        $(this).delay(tmpaudio.duration * 1000);
                        $(this).dequeue();
                    });


            };

        }
    }
}

for (let key in userConfig) {
    emoticons.push(userConfig[key]["emote"]);
    userConfig[key]['counter'] = 0;
    userConfig[key]['cooldownEnd'] = 0;
    userConfig[key]['timer'] = 0;
}

let t = setInterval(function () {
    for (let key in userConfig) {
        userConfig[key]['timer'] = Math.max((userConfig[key]['timer'] - 1), 0);
        if (userConfig[key]['timer'] === 0) {
            userConfig[key]['counter'] = 0;
        }
    }
}, 1000);
