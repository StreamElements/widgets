let userOptions = {};
let users = [];
let votes = {a: 0, b: 0};
let isActive = false;
let time = 0;
let interval;
let regexA, regexB;
window.addEventListener('onEventReceived', function (obj) {
        if (obj.detail.listener !== 'message') return;

        let data = obj.detail.event.data;
        let message = data['text'].toLowerCase();

        let user = data['nick'];
        let userstate = {
            'mod': parseInt(data.tags.mod),
            'sub': parseInt(data.tags.subscriber),
            'vip': (data.tags.badges.indexOf("vip") !== -1),
            'badges': {
                'broadcaster': (user === userOptions['channelName']),
            }

        };
        if (((userstate.mod && userOptions['managePermissions'] === 'mods') || userstate.badges.broadcaster) && message.startsWith(userOptions['startCommand'])) {
            if (message.startsWith(userOptions['startCommand']) && !isActive) {

                users = [];
                votes = {a: 0, b: 0};
                isActive = true;
                $("#optiona").css("height", '50%');
                $("#optionb").css("height", '50%');
                $(".main-container").fadeIn();
                time = userOptions['pollTime'];
                interval = setInterval(countDown, 1000);
                return;
            }

        }

        if (!isActive) return;
        if (userOptions['onlyUniqueUsers'] === "yes" && users.indexOf(user) !== -1) return false;
        if (userOptions['participants'] === "subs" && !userstate.sub) return false;
        if (message.search(regexA) > -1) {

            vote('a', user);
        } else if (message.search(regexB) > -1) {

            vote('b', user);
        }

    }
);

function vote(option, username) {
    users.push(username);
    votes[option]++;
    let sizea = Math.round(votes['a'] / (votes['a'] + votes['b']) * 100);
    let sizeb = Math.round(votes['b'] / (votes['a'] + votes['b']) * 100);
    $("#optiona").css("height", `${sizea}%`);
    $("#optionb").css("height", `${sizeb}%`);
}

function countDown() {
    time--;
    $("#timer").html(time);
    if (time < 1) {
        clearInterval(interval);
        announceResults();
    }
}

function announceResults() {
    isActive = false;
    let message = userOptions['chatDecided'] + " ";
    if (votes['a'] === votes['b']) {
        message = userOptions['chatDidntDecide'];
    } else if (votes['a'] > votes['b']) {
        message += userOptions['optionA'];
    } else {
        message += userOptions['optionB'];
    }
    let myAudio = new Audio('//api.streamelements.com/kappa/v2/speech?voice=' + userOptions['voice'] + '&text=' + encodeURI(message));
    myAudio.addEventListener('ended', function () {

        $(".main-container").fadeOut();

    }, false);
    myAudio.volume = parseInt(userOptions['volume']) / 100;
    myAudio.play();

}

window.addEventListener('onWidgetLoad', function (obj) {
    userOptions = obj['detail']['fieldData'];
    userOptions['channelName'] = obj['detail']['channel']['username'];
    regexA = new RegExp('\\b' + userOptions['optionA'].toLowerCase() + '\\b');
    regexB = new RegExp('\\b' + userOptions['optionB'].toLowerCase() + '\\b');
});

