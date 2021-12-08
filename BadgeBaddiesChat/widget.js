let totalMessages = 0, messagesLimit = 0, nickColor = 'user';
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let hideAfter = 60;
let hideCommands = 'no';
let ignoredUsers = [];
let allowedDefaults = [];
let peerPressure = 0;
let peerPressureThreshold = 20;
let peerPressureCommand = '!pressure'
let peerPressureDuration = 20;
let peerPressureTimer;

window.addEventListener('onEventReceived', async function (obj) {
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
                            // text: "Howdy! My name is Bill and I am here to serve Kappa",
                            text: '!doritos',
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

  // Check for and handle commands
  if (data.text.startsWith("!")) {
    const command = data.text.split(" ")[0];
    console.log({ peerPressure, peerPressureCommand, peerPressureThreshold })
    // Handle peer pressure
    if (command === peerPressureCommand) {
      peerPressure++;
	  
      if (peerPressure === peerPressureThreshold) {
        $('#chips').addClass('chips--show');
      }
      
      // Set (or reset) timer for peer pressure
      if (peerPressure >= peerPressureThreshold) {
        clearTimeout(peerPressureTimer);
        peerPressureTimer = setTimeout(() => {
          peerPressure = 0;
          $('#chips').removeClass('chips--show');
        }, peerPressureDuration * 1000)
      }
    }
    
    if (hideCommands === 'yes') {
      return;
    }
  }

  if (ignoredUsers.indexOf(data.nick) !== -1) return;
  let message = attachEmotes(data);
  let username = data.displayName;
  const color = data.displayColor;
  let showPeerPressure = peerPressure >= peerPressureThreshold;
  let peerPressureBadgeClass = ''
  if (showPeerPressure) {
    peerPressureBadgeClass = 'message__badge--peer_pressure'
  }
  let userBadges = await memoizedGetUserBadges(username);
  let badges = '', badge;
  
  // Load default twitch badges
  for (let i = 0; i < data.badges.length; i++) {
    badge = data.badges[i];
    if (allowedDefaults.includes(badge.type)) {
      badges += `<img alt="" src="${badge.url}" class="message__badge ${peerPressureBadgeClass}">`;
    }
  }
  
  // Insert user badges
  if (!!userBadges && Array.isArray(userBadges)) {
    for (let i = 0; i < userBadges.length; i++) {
      badges += `<img alt="" src="${userBadges[i]}" class="message__badge ${peerPressureBadgeClass}">`
    }
  }
  
  // Insert peer pressure badges
  if (showPeerPressure) {
    badges += `<img alt="" src="{peerPressureImage}" class="message__badge ${peerPressureBadgeClass}">`;
  }
  

  addEvent(username, badges, message, data.isAction, color, showPeerPressure);
});

/**
 * Actions to perform when the widget first loads
 * Set variables based on fieldData values, fetch config, etc.
 */
window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj.detail.fieldData;
  animationIn = fieldData.animationIn;
  animationOut = fieldData.animationOut;
  hideAfter = fieldData.hideAfter;
  messagesLimit = fieldData.messagesLimit;
  nickColor = fieldData.nickColor;
  hideCommands = fieldData.hideCommands;
  ignoredUsers = fieldData.ignoredUsers.toLowerCase().replace(" ", "").split(",");
  allowedDefaults = fieldData.allowedDefaults.toLowerCase().replace(" ", "").split(",");
  peerPressureCommand = fieldData.peerPressureCommand;
  peerPressureThreshold = fieldData.peerPressureThreshold;
  peerPressureDuration = fieldData.peerPressureDuration;
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
           return `<img alt="" src="${url}" class="message__emote"/>`;
        } else return key;
      }
    );
}

function html_encode(e) {
  return e.replace(/[\<\>\"\^]/g, function (e) {
    return "&#" + e.charCodeAt(0) + ";";
  });
}

/**
 * Add chat messages to #log
 * @param {string} username 
 * @param {array} badges - badge object from Twitch 
 * @param {string} message 
 * @param {boolean} isAction 
 * @param {string} color - color attached to the user, from Twitch
 * @param {boolean} showPeerPressure - true if message was created while peerPressure is active
 */
async function addEvent(username, badges, message, isAction, color, showPeerPressure) {
  totalMessages += 1;
  let actionClass = '';
  let peerPressureNameClass = '';

  if (isAction) {
    actionClass = 'action';
  }

  if (showPeerPressure) {
    peerPressureNameClass = 'message__username--peer_pressure'
  }

  const element = $.parseHTML(`
    <div class="message {animationIn}" id="msg-${totalMessages}">
      <div class="message__badges ${actionClass}">${badges}</div>
      <span class="message__username ${peerPressureNameClass}" style="color: ${color}">${username}:</span>
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

/**
 * Remove a message from the #log
 * @param {number} id message ID
 * @returns 
 */
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

/**
 * Memoized function to fetch badges from the API
 * @param {string} username 
 */
function getUserBadges() {
  let cache = {};
  return (username) => {
    if (username in cache) {
      console.log(`${username}'s badges were cached: '`, cache[username]);
      return cache[username]
    } else {
      console.log(`${username}'s badges were not cached - fetching!'`)
      return fetch(`https://badgies-v2.herokuapp.com/find/${username}`, { method: 'GET' })
        .then(response => response.json())
        .then(({ data }) => {
          const value = data.multiple_image || [];
          cache[username] = value;
          return value;
      })
    }
  }
}

const memoizedGetUserBadges = getUserBadges();