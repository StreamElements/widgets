let keyXYZ = false;
let channel = "";
let users = [];
let queueCommand, drawCommand, clearCommand, purgeCommand;
let client;

function addToQueue(user) {
    if (users.indexOf(user) !== -1) return false;
    users.push(user);
    saveState(users);
    return true;
}

function drawFromQueue(amount) {
    for (i = 0; i < Math.min(users.length, amount); i++) {
        $("#users").append(`<li>${users[i]}</li>`)
    }
    users = users.slice(amount);
    saveState(users);
}

function clearScreen() {
    $("#users").empty();
}

function purge() {
    users = [];
    saveState(users);
}

function saveState(value) {
    $.post("https://api.keyvalue.xyz/" + keyXYZ + "/StreamElements/" + JSON.stringify(value), function (data) {
    });
}

function loadState() {
    $.getJSON("https://api.keyvalue.xyz/" + keyXYZ + "/StreamElements", function (data) {
        users = data;
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
        if (message === queueCommand) {
            addToQueue(user);
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