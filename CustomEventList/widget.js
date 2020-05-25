let eventsLimit = 5,
    badges = {},
    subLabel,
    userLocale = "en-US",
    direction = "top",
    textOrder = "nameFirst",
    fieldData,
    fadeoutTime, fadeoutTimeout;

let userCurrency,
    totalEvents = 0;

const getBadge = months => {
    let badge = 0;
    for (let number in badges) {
        if (months < number) break
        badge = number;
    }
    return `<img alt="${months} months" src="${badges[badge].image_url_2x}" class="badge"/>`;
};

const checkSub = (event) => {
    if (fieldData.subAggregate && event.isCommunityGift && !event.bulkGifted) return false; // Sub aggregation exit
    if (event.isCommunityGift || event.amount >= fieldData.minimumSubDuration) return true; // Minimum duration check
    if (parseInt(event.tier) >= 2000 && fieldData.minimumSubTier === "t2") return true; // Tier 2 check
    if (parseInt(event.tier) === 3000 && fieldData.minimumSubTier === "t3") return true; // Tier 3 check
    return false;
}

const wrapText = (message, event) => {
    return message.replace("{name}", event.name)
        .replace("{amount}", event.amount)
        .replace("{sender}", event.sender)
        .replace("{tier}", event.tier)
        .replace("{currency}", userCurrency.code)
        .replace("{prefix}", event.prefix);
};

const parseEvent = (event, isHistorical) => {

    if (!fieldData[`${event.type}-include`]) return;
    if (typeof fieldData[`${event.type}-min`] !== undefined) {
        if (fieldData[`${event.type}-min`] > event.amount) return;
    }
    if (event.type === 'subscriber') {
        if (!checkSub(event)) return;

        let prefix = "Sub ";
        if (subLabel === "badge") {
            prefix = getBadge(event.amount);
        }
        event.prefix = prefix;
        if (event.gifted || event.bulkGifted) {
            if (event.bulkGifted) {
                addEvent(event.type, wrapText(fieldData['sub-community-text'], event), event.name, isHistorical);
            } else {
                addEvent(event.type, wrapText(fieldData['sub-gift-text'], event), event.name, isHistorical);
            }
        } else {
            addEvent(event.type, wrapText(fieldData['sub-text'], event), event.name, isHistorical);
        }

    } else if (event.type === 'tip') {

        if (event.amount === parseInt(event.amount)) {
            event.amount = event.amount.toLocaleString(userLocale, {
                style: 'currency',
                minimumFractionDigits: 0,
                currency: userCurrency.code
            });
        } else {
            event.amount = event.amount.toLocaleString(userLocale, {
                style: 'currency',
                currency: userCurrency.code
            });
        }
        addEvent(event.type, wrapText(fieldData[`${event.type}-text`], event), event.name, isHistorical);
    } else {
        addEvent(event.type, wrapText(fieldData[`${event.type}-text`], event), event.name, isHistorical);
    }
};


const getBadges = apiKey => {
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


const addEvent = (type, text, username, isHistorical) => {
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

const removeEvent = (eventId) => {
    $(`#event-${eventId}`).removeClass(`{animationIn}`).addClass(`{animationOut}`);
    setTimeout(() => {
        $(`#event-${eventId}`).remove();
    }, 1000);
};