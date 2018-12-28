let userOptions = {
    channelName: "",
    wordTimer: "",
    wordsLimit: "",
    firstLetter: "", //if you want to limit just to hashtags or username mentions use # or @
    onlyUniqueUsers: "", //Allow users to have just one vote only
};
let words = [];
let users = [];


window.addEventListener('onWidgetLoad', function (obj) {
    userOptions["channelName"] = obj["detail"]["channel"]["username"];
    userOptions["wordTimer"] = obj["detail"]["fieldData"]["wordTimer"];
    userOptions["wordsLimit"] = obj["detail"]["fieldData"]["wordsLimit"];
    userOptions["firstLetter"] = obj["detail"]["fieldData"]["firstLetter"];
    userOptions["onlyUniqueUsers"] = (obj["detail"]["fieldData"]["onlyUniqueUsers"] === "yes");
});

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let message = data["text"];
    let user = data["displayName"];
    let userstate = {
        "mod": parseInt(data.tags.mod),
        "badges": {
            "broadcaster": (user === userOptions["channelName"])
        }

    };
    if (message === '!resetpoll' && (userstate.mod || userstate.badges.broadcaster)) {
        words = [];
        users = [];
        return;
    }
    if (userOptions.onlyUniqueUsers && users.indexOf(userstate.username) !== -1) return false;
    let parts = message.split(" ");
    for (let i in parts) {
        if (poll(parts[i])) {
            users.push(userstate.username);
            return;
        }
    }

});

function poll(word) {
    if (userOptions.firstLetter !== "" && userOptions.firstLetter !== word.charAt(0)) return false;
    var index = words.findIndex(p => p.word === word);

    if (index === -1) {
        words.push({
            word: word,
            count: 1,
            timer: userOptions.wordTimer,
        });
    }
    else {
        words[index]['count']++;
        words[index]['timer'] = userOptions.wordTimer;
    }
    return true;
}



let t = setInterval(function () {
    for (let key in words) {
        words[key]['timer'] = Math.max((words[key]['timer'] - 1), 0);
        if (words[key]['timer'] === 0) {
            delete words[key];
        }
    }
    displayWords();
}, 1000);

function displayWords() {
    words.sort(function (a, b) {
        return b.count - a.count;
    });

    let limit = Math.min(userOptions.wordsLimit, Object.keys(words).length);

    let starting = words.length - limit;
    let row;
    $("#words").html("");
    for (let wordIndex = starting; wordIndex < words.length; wordIndex++) {

        row = words[wordIndex];
        $("#words").append(`<div class="wordRow"><div class="word">${row.word}</div> <div class="amount">${row.count}</div> </div>`);
    }
}