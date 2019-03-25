let totalMessages = 0, messagesLimit = 0, nickColor = "user";
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let hideAfter = 60;
let hideCommands = "no";
let ignoredUsers = [];
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    if (data.text.startsWith("!") && hideCommands === "yes") return;
    if (ignoredUsers.indexOf(data.nick) !== -1) return;
    let message = attachEmotes(data);
    let badges = "", badge;
    for (let i = 0; i < data.badges.length; i++) {
        badge = data.badges[i];
        badges += `<img alt="" src="${badge.url}" class="badge"> `;
    }
    let username = data.displayName;
    if (nickColor === "user") {
        const color = data.displayColor;
        username = `<span style="color:${color}">${username}</span>`;
    }
    addEvent(username, badges, message, data.isAction);
});

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    animationIn = fieldData.animationIn;
    animationOut = fieldData.animationOut;
    hideAfter = fieldData.hideAfter;
    messagesLimit = fieldData.messagesLimit;
    nickColor = fieldData.nickColor;
    hideCommands = fieldData.hideCommands;
    ignoredUsers = fieldData.ignoredUsers.toLowerCase().replace(" ", "").split(",");
});


function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    return text
        .replace(
            /([^\s]*)/gi,
            function (m, key) {
                let result = data.filter(emote => {
                    return emote.name === key
                });
                if (typeof result[0] !== "undefined") {
                    let url = result[0]['urls'][4];
                    return `<img alt="" src="${url}" class="emote"/>`;
                } else return key;

            }
        );
}

function html_encode(e) {
    return e.replace(/[\<\>\"\^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function addEvent(username, badges, message, isAction) {
    totalMessages += 1;
    let actionClass = "";
    if (isAction) {
        actionClass = "action";
    }
    const element = $.parseHTML(`
    <div class="message-row {animationIn} animated" id="msg-${totalMessages}">
        <div class="user-box ${actionClass}">${badges}${username}</div>
        <div class="user-message ${actionClass}">${message}</div>
    </div>`);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).queue(function () {
            $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove()
            }).dequeue();
        });
    } else {
        $(element).appendTo('.main-container');
    }

    if (totalMessages > messagesLimit) {
        removeRow(totalMessages - messagesLimit);
    }
}

function removeRow(id) {
    if (!$(`#msg-${id}`).length) {
        return;
    }
    if (animationOut !== "none" || !$(`#msg-${id}`).hasClass(animationOut)) {
        if (hideAfter !== 999) {
            $(`#msg-${id}`).dequeue();
        } else {
            $(`#msg-${id}`).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove().dequeue()
            });

        }
        return;
    }

    $(`#msg-${id}`).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(`#msg-${id}`).remove();
    });
}