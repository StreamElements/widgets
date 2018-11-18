var userOptions = {
    keyXYZ: "",
};


var commands = {
    "wins": {
        description: "Current win counter",
        add: "win",
        remove: "delwin",
        reset: "resetwins",
        modsonly: true
    },
    "loses": {
        description: "Current loss counter",
        add: "lose",
        remove: "dellose",
        reset: "resetloses",
        modsonly: true
    },

};
values = {};


var audio, name = '';

let channel;
window.addEventListener('onWidgetLoad', function(obj) {
    channel=obj["detail"]["channel"]["username"];
});

let clientOptions = {
    connection: {
        reconnect: true,
        secure: true,
    },
    channels: [channel]
};

$.each(commands, function (index, value) {
    values[index] = 0;
});


const client = new TwitchJS.client(clientOptions);

client.on('message', function (channel, userstate, message) {
    if (message.charAt(0) !== "!") {
        return;
    }

    $.each(commands, function (index, value) {

        // ADD

        if (message == "!" + value.add) {
            //  $("#debug").append(JSON.stringify(userstate));
            if (!value.modsonly || (value.modsonly && (userstate.mod || userstate.badges.broadcaster))) {
                changeValue(index, "add");
            }
            return false;
        }
        else {
            // REMOVE

            if (message == "!" + value.remove) {

                if (!value.modsonly || (value.modsonly && (userstate.mod || userstate.badges.broadcaster))) {
                    changeValue(index, "remove");
                }
                return false;
            }
            else {
                // RESET

                if (message == "!" + value.reset) {
                    if (!value.modsonly || (value.modsonly && (userstate.mod || userstate.badges.broadcaster))) {
                        changeValue(index, "reset");
                    }
                    return false;
                }


            }
        }


    });

});

function changeValue(index, type) {
    if (type === "add") {
        values[index]++;
    }
    else if (type === "remove") {
        values[index]--;
    }
    else if (type === "reset") {
        values[index] = 0;
    }
//    $("#debug").append(index+" "+type);
    updateOverlay(index, values[index]);
}

function updateOverlay(index, value) {
    $("#" + index + "value").text(value);
    saveState(values);
}

function generateDivs() {
    $.each(values, function (index, value) {
        $("#container").append(`<div class="counter">${commands[index]['description']}: <span class="value" id="${index}value">${value}</span>`);
    });
}

if (userOptions.keyXYZ !== "") {
    loadState();
    client.connect();
    generateDivs();

}
else {
    $.post("https://api.keyvalue.xyz/new/StreamElements", function (data) {
        var parts = data.slice(1, -1).split("/");
        $("body").append('SET keyXYZ value in your JS tab to "' + parts[3] + '"');
    });
}

function saveState(obj) {
    value = JSON.stringify(obj);
    $.post("https://api.keyvalue.xyz/" + userOptions.keyXYZ + "/StreamElements/" + value, function (data) {
    });
}

function loadState() {
    $.get({
        url: "https://api.keyvalue.xyz/" + userOptions.keyXYZ + "/StreamElements",
        async: false,
        success: function (data) {
            if (data.length > 3) {
                values = JSON.parse(data);
            }
            else {
                saveState(values);
            }
        }
    });
}
