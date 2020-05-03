let eventsLimit = 5,
    badges = {},
    subLabel,
    userLocale = "en-US",
    includeFollowers = true,
    includeRedemptions = true,
    includeHosts = true,
    minHost = 0,
    includeRaids = true,
    minRaid = 0,
    includeSubs = true,
    includeTips = true,
    minTip = 0,
    includeCheers = true,
    direction = "top",
    textOrder = "nameFirst",
    minCheer = 0,
    fieldData,
    fadeoutTime, fadeoutTimeout;

let userCurrency,
    totalEvents = 0;

let getBadge = months => {
    let badge = 0;
    for (let number in badges) {
        if (months < number) break
        badge = number;
    }
    return `<img alt="${months} months" src="${badges[badge].image_url_2x}" class="badge"/>`;
};

let parseEvent = (event, isHistorical) => {
        if (event.type === 'follower') {
            if (includeFollowers) {
                addEvent('follower', 'Follower', event.name, isHistorical);
            }
        } else if (event.type === 'redemption') {
            if (includeRedemptions) {
                addEvent('redemption', 'Redeemed', event.name, isHistorical);
            }
        } else if (event.type === 'subscriber') {
            if (!includeSubs) return;
            let prefix = "Sub ";
            if (subLabel === "badge") {
                prefix = getBadge(event.amount);
            }
            if (event.gifted || event.bulkGifted) {
                if (fieldData.subAggregate && event.isCommunityGift && !event.bulkGifted) return;
                if (event.bulkGifted) {
                    addEvent('sub', `${prefix} gift X${event.amount}`, event.name, isHistorical);
                } else {
                    if (fieldData.giftDisplay === 'both') {
                        addEvent('sub', `${prefix} gift from ${sender}`, event.name, isHistorical);
                    } else if (fieldData.giftDisplay === 'gifted') {
                        addEvent('sub', `${prefix}`, event.name, isHistorical);
                    } else {
                        addEvent('sub', `${prefix}`, event.sender, isHistorical);
                    }

                }

            } else {
                addEvent('sub', `${prefix} X${event.amount}`, event.name, isHistorical);
            }

        } else if (event.type === 'host') {
            if (includeHosts && minHost <= event.amount) {
                addEvent('host', `Host ${event.amount.toLocaleString()}`, event.name, isHistorical);
            }
        } else if (event.type === 'cheer') {
            if (includeCheers && minCheer <= event.amount) {
                addEvent('cheer', `${event.amount.toLocaleString()} Bits`, event.name, isHistorical);
            }
        } else if (event.type === 'tip') {
            if (includeTips && minTip <= event.amount) {
                if (event.amount === parseInt(event.amount)) {
                    addEvent('tip', event.amount.toLocaleString(userLocale, {
                        style: 'currency',
                        minimumFractionDigits: 0,
                        currency: userCurrency.code
                    }), event.name, isHistorical);
                } else {
                    addEvent('tip', event.amount.toLocaleString(userLocale, {
                        style: 'currency',
                        currency: userCurrency.code
                    }), event.name, isHistorical);
                }
            }
        } else if (event.type === 'raid') {
            if (includeRaids && minRaid <= event.amount) {
                addEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name, isHistorical);
            }
        }

    }
;

let getBadges = apiKey => {
    return new Promise(resolve => {
        fetch("https://api.streamelements.com/kappa/v2/channels/me", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "authorization": `apikey ${apiKey}`
            }, "method": "GET"
        }).then(response => response.json()).then(obj => {
            fetch(`https://badges.twitch.tv/v1/badges/channels/${obj.providerId}/display`).then(response => response.json()).then(data => {
                if (data.badge_sets.subscriber.versions) {
                    Object.keys(data.badge_sets.subscriber.versions).sort().forEach(function (key) {
                        badges[key] = data.badge_sets.subscriber.versions[key];
                    });
                    resolve("badge");
                } else {
                    resolve("sub");
                }
            }).catch(() => {
                resolve("sub");
            })
        }).catch(() => {
            resolve("sub");
        });
    })
};
window.addEventListener('onEventReceived', function (obj) {
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    event.type = listener;
    parseEvent(event, 0);
});


window.addEventListener('onWidgetLoad', function (obj) {
    let recents = obj.detail.recents;
    recents.sort(function (a, b) {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
    userCurrency = obj.detail.currency;
    fieldData = obj.detail.fieldData;
    eventsLimit = fieldData.eventsLimit;
    includeFollowers = (fieldData.includeFollowers === "yes");
    includeRedemptions = (fieldData.includeRedemptions === "yes");
    includeHosts = (fieldData.includeHosts === "yes");
    minHost = fieldData.minHost;
    includeRaids = (fieldData.includeRaids === "yes");
    minRaid = fieldData.minRaid;
    includeSubs = (fieldData.includeSubs === "yes");
    includeTips = (fieldData.includeTips === "yes");
    minTip = fieldData.minTip;
    includeCheers = (fieldData.includeCheers === "yes");
    minCheer = fieldData.minCheer;
    direction = fieldData.direction;
    userLocale = fieldData.locale;
    textOrder = fieldData.textOrder;
    fadeoutTime = fieldData.fadeoutTime;
    subLabel = fieldData.subLabel;
    if (fieldData.subLabel === "badge") {
        getBadges(obj.detail.channel.apiToken).then((result) => {
            subLabel = result;
            console.log("We are using: " + result);
            let eventIndex;
            for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
                const event = recents[eventIndex];
                parseEvent(event, 1)
            }
        });
    } else {
        let eventIndex;
        for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
            const event = recents[eventIndex];
            parseEvent(event, 1)
        }
    }
    setTimeout(() => {
        $(".main-container").show();
    }, 2500);

});


function addEvent(type, text, username, isHistorical) {
    clearTimeout(fadeoutTimeout);
    totalEvents += 1;
    let element;
    const showClass = isHistorical ? '' : '{animationIn}';
    if (textOrder === "actionFirst") {
        element = `
    <div class="event-container animated ${showClass}" id="event-${totalEvents}">
		<div class="backgroundsvg"></div>
        <div class="event-image event-${type} {imageType}"></div>
        <div class="username-container">${text}</div>
       <div class="details-container">${username}</div>
    </div>`;
    } else {
        element = `
    <div class="event-container animated ${showClass}"  id="event-${totalEvents}">
		<div class="backgroundsvg"></div>
        <div class="event-image event-${type} {imageType}"></div>
        <div class="username-container">${username}</div>
       <div class="details-container">${text}</div>
    </div>`;
    }
    if (direction === "bottom") {
        if (isHistorical) {
            $('.main-container').append(element);
        } else {
            $('.main-container').removeClass("fadeOutClass").append(element);
        }
    } else {
        if (isHistorical) {
            $('.main-container').prepend(element);
        } else {
            $('.main-container').removeClass("fadeOutClass").prepend(element);
        }
    }
    if (fadeoutTime !== 999) {
        fadeoutTimeout = setTimeout(() => {
            $('.main-container').addClass("fadeOutClass");
        }, fadeoutTime * 1000);
    }
    if (totalEvents > eventsLimit) {
        removeEvent(totalEvents - eventsLimit);
    }
}

function removeEvent(eventId) {
    $(`#event-${eventId}`).removeClass(`{animationIn}`).addClass(`{animationOut}`);
    setTimeout(() => {
        $(`#event-${eventId}`).remove();
    }, 1000);

}