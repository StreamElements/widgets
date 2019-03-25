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
let values = {};

let name = '';
let channel;

window.addEventListener('onWidgetLoad', function (obj) {
    channel = obj["detail"]["channel"]["username"];

});


let emptyvalues = {};
$.each(commands, function (index, value) {
    emptyvalues[index] = 0;
});
values = emptyvalues;

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let message = html_encode(data["text"]);
    let user = data["displayName"];
    let userstate = {
        "mod": parseInt(data.tags.mod),
        "badges": {
            "broadcaster": (user === channel)
        }

    };
    if (message.charAt(0) !== "!") {
        return;
    }
    if (message === "!fullreset") {
        if (userstate.mod || userstate.badges.broadcaster) {
            values = emptyvalues;
            $("#container").empty();
            generateDivs();
        }
        return false;
    }
    $.each(commands, function (index, value) {

        // ADD

        if (message === "!" + value.add) {
            //  $("#debug").append(JSON.stringify(userstate));
            if (!value.modsonly || (value.modsonly && (userstate.mod || userstate.badges.broadcaster))) {
                changeValue(index, "add");
            }
            return false;
        } else {
            // REMOVE

            if (message === "!" + value.remove) {

                if (!value.modsonly || (value.modsonly && (userstate.mod || userstate.badges.broadcaster))) {
                    changeValue(index, "remove");
                }
                return false;
            } else {
                // RESET

                if (message === "!" + value.reset) {
                    if (!value.modsonly || (value.modsonly && (userstate.mod || userstate.badges.broadcaster))) {
                        changeValue(index, "reset");
                    }
                    return false;
                }


            }
        }


    });


});

function html_encode(e) {
    return e.replace(/[\<\>\"\^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}


function changeValue(index, type) {
    if (type === "add") {
        values[index]++;
    } else if (type === "remove") {
        values[index]--;
    } else if (type === "reset") {
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
        $("#container").append(`<div class="counter">${commands[index]['description']}<span class="value" id="${index}value">${value}</span>`);
    });
}


loadState();


function saveState(obj) {
    SE_API.store.set('commandCounters', obj);
}


function loadState() {
    SE_API.store.get('commandCounters').then(obj => {
        console.log(obj);
        if (obj !== null && typeof obj !== "undefined") {
            values = obj;
        } else {
            saveState(values);
        }
        generateDivs();
    });

}

