let keyXYZ = false;
let channel = "";
let users = [];
let nicknames = [];
let queueCommand, drawCommand, clearCommand, purgeCommand;
let client;

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
    nicknames = []
    saveState([users, nicknames]);
}

function saveState(value) {
    $.post("https://api.keyvalue.xyz/" + keyXYZ + "/StreamElements/" + JSON.stringify(value), function (data) {
    });
}

function loadState() {
    $.getJSON("https://api.keyvalue.xyz/" + keyXYZ + "/StreamElements", function (data) {

        if (data.length === 2) {
            users = data[0];
            nicknames = data[1];
        }
    });

}

window.addEventListener('onWidgetLoad', function (obj) {
    channel = obj["detail"]["channel"]["username"];
    const fieldData = obj.detail.fieldData;
    queueCommand = fieldData["queue"];
    drawCommand = fieldData["draw"];
    purgeCommand = fieldData["purge"];
    clearCommand = fieldData["clear"];
    keyXYZ = fieldData.keyXYZ;
    if (keyXYZ) {
        loadState();
        clientConnect();
    } else {
        $.post("https://api.keyvalue.xyz/new/StreamElements", function (data) {
            var parts = data.slice(1, -1).split("/");
            $("#users").html('SET keyXYZ value in your config to "' + parts[3] + '"');
        });
    }
});

function clientConnect() {
    let clientOptions = {
        connection: {
            reconnect: true,
            secure: true,
        },
        channels: [channel]
    };
    client = new TwitchJS.client(clientOptions);
    client.on('message', function (channel, userstate, message) {
        let user = userstate["username"];
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
        if ('#' + user !== channel) return;
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
    client.connect();
}