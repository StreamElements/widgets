let totalMessages = 0, messagesLimit = 0, nickColor = 'user';
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let hideAfter = 60;
let hideCommands = 'no';
let ignoredUsers = [];

window.addEventListener('onEventReceived', function (obj) {
  // Test Button - remove as and when required
  if (obj.detail.event.listener === 'widget-button') {
        if (obj.detail.event.field === 'testMessage') {
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "message", event: {
                        service: "twitch",
                        data: {
                            time: Date.now(),
                            tags: {
                                "badge-info": "",
                                badges: "moderator/1,partner/1",
                                color: "#5B99FF",
                                "display-name": "StreamElements",
                                emotes: "25:46-50",
                                flags: "",
                                id: "43285909-412c-4eee-b80d-89f72ba53142",
                                mod: "1",
                                "room-id": "85827806",
                                subscriber: "0",
                                "tmi-sent-ts": "1579444549265",
                                turbo: "0",
                                "user-id": "100135110",
                                "user-type": "mod"
                            },
                            nick: channelName,
                            userId: "100135110",
                            displayName: channelName,
                            displayColor: "#5B99FF",
                            badges: [{
                                type: "moderator",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                                description: "Moderator"
                            }, {
                                type: "partner",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                                description: "Verified"
                            }],
                            channel: channelName,
                            text: "Howdy! My name is Bill and I am here to serve Kappa",
                            isAction: !1,
                            emotes: [{
                                type: "twitch",
                                name: "Kappa",
                                id: "25",
                                gif: !1,
                                urls: {
                                    1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                                },
                                start: 46,
                                end: 50
                            }],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: 'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
                    }
                }
            });
            window.dispatchEvent(emulated);
        }
        return;
    }
  if (obj.detail.listener !== 'message') return;
  let data = obj.detail.event.data;
  if (data.text.startsWith("!") && hideCommands === 'yes') return;
  if (ignoredUsers.indexOf(data.nick) !== -1) return;
  let message = attachEmotes(data);
  let badges = '', badge;
  for (let i = 0; i < data.badges.length; i++) {
      badge = data.badges[i];
      badges += `<img alt="" src="${badge.url}" class="message__badge"> `;
  }
  let username = data.displayName;
  const color = data.displayColor;

  addEvent(username, badges, message, data.isAction, color);
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
  channelName = obj.detail.channel.username;
});

function attachEmotes(msg) {
  let text = html_encode(msg.text);
  let data = msg.emotes;
  return text
    .replace(
      /([^\s]*)/gi,
      function (m, key) {
        let result = data.filter(emote => {
          return emote.name === key
        });
        if (typeof result[0] !== "undefined") {
          let url = result[0]['urls'][1];
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

function addEvent(username, badges, message, isAction, color) {
  totalMessages += 1;
  let actionClass = '';

  if (isAction) {
    actionClass = 'action';
  }

  const element = $.parseHTML(`
    <div class="message {animationIn}" id="msg-${totalMessages}">
        <div class="message__badges ${actionClass}">${badges}</div>
        <span class="message__username" style="color: ${color}">${username}</span>
        <span class="message__text ${actionClass}">${message}</span>
    </div>`
  );

  if (hideAfter !== 999) {
    $(element).appendTo('#log').delay(hideAfter * 1000).queue(function () {
      $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
        $(this).remove()
      }).dequeue();
    });
  } else {
    $(element).appendTo('#log')
  }

  if (totalMessages > messagesLimit) {
    removeRow(totalMessages - messagesLimit);
  }
}

function removeRow(id) {
  const selector = `#msg-${id}`
  if (!$(selector).length) {
    return;
  }
  if (animationOut !== 'none' || !$(selector).hasClass(animationOut)) {
    if (hideAfter !== 999) {
      $(selector).dequeue();
    } else {
      $(selector).addClass(animationOut).delay(1000).queue(function () {
        $(this).remove().dequeue();
      });
    }
    return;
  }
  $(selector).animate({
      height: 0,
      opacity: 0
  }, 'slow', function () {
    $(selector).remove();
  })
}