let channel = "";
let users = [];
let nicknames = [];
let queueCommand, drawCommand, clearCommand, purgeCommand;


function addToQueue(user, nickname) {
    if (users.indexOf(user) !== -1) return false;
    users.push(user);
    nicknames.push(nickname);
    saveState([users, nicknames]);
    return true;
}

function drawFromQueue(amount) {
    for (i = 0; i < Math.min(nicknames.length, amount); i++) {
        $("#users").append(`<li>${users[i]}: ${nicknames[i]}</li>`)
    }
    users = users.slice(amount);
    nicknames = nicknames.slice(amount);
    saveState([users, nicknames]);
}

function clearScreen() {
    $("#users").empty();
}

function purge() {
    users = [];
    nicknames = [];
    saveState([users, nicknames]);
}

function saveState(value) {
    SE_API.store.set('userQueue', value);

}

function loadState() {
    SE_API.store.get('userQueue').then(obj => {

        if (obj !== null) {
            users = data[0];
            nicknames = data[1];
        } else SE_API.store.set('userQueue', [users, nicknames])
    });

}

window.addEventListener('onWidgetLoad', function (obj) {
    channel = obj["detail"]["channel"]["username"];
    const fieldData = obj.detail.fieldData;
    queueCommand = fieldData["queue"];
    drawCommand = fieldData["draw"];
    purgeCommand = fieldData["purge"];
    clearCommand = fieldData["clear"];


    loadState();


});

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let message = html_encode(["text"]);
    let user = data["displayName"];
    if (message.indexOf(queueCommand) === 0) {
        message = message.split(" ");
        message = message.slice(1);
        let nickname = user;
        if (message.length > 0) {
            nickname = message.join(" ");
        }
        addToQueue(user, nickname);
        return;
    }
    // Broadcaster commands only below
    if (user !== channel) return;
    if (message.indexOf(drawCommand) === 0) {
        message = message.split(" ");
        drawFromQueue(message[1]);
        return;
    }
    if (message === clearCommand) {
        clearScreen();
        return;
    }
    if (message === purgeCommand) {
        clearScreen();
        return;
    }


});

function html_encode(e) {
    return e.replace(/[\<\>\"\^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}
