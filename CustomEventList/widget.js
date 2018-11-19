let eventsLimit = 5,
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
    minCheer = 0;

let userCurrency,
    totalEvents = 0;

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    if (listener === 'follower') {
        if (includeFollowers) {
            addEvent('follower', 'Follower', event.name);
        }
    } else if (listener === 'redemption') {
        if (includeRedemptions) {
            addEvent('redemption', 'Redeemed', event.name);
        }
    } else if (listener === 'subscriber') {
        if (includeSubs) {
            if (event.amount === 'gift') {
                addEvent('sub', `Sub gift`, event.name);
            } else {
                addEvent('sub', `Sub X${event.amount}`, event.name);
            }
        }
    } else if (listener === 'host') {
        if (includeHosts && minHost <= event.amount) {
            addEvent('host', `Host ${event.amount.toLocaleString()}`, event.name);
        }
    } else if (listener === 'cheer') {
        if (includeCheers && minCheer <= event.amount) {
            addEvent('cheer', `${event.amount.toLocaleString()} Bits`, event.name);
        }
    } else if (listener === 'tip') {
        if (includeTips && minTip <= event.amount) {
            addEvent('tip', `${userCurrency.symbol}${event.amount.toLocaleString()}`, event.name);
        }
    } else if (listener === 'raid') {
        if (includeRaids && minRaid <= event.amount) {
            addEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name);
        }
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    let recents = obj.detail.recents;
    recents.sort(function (a, b) {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
    userCurrency = obj.detail.currency;
    const fieldData = obj.detail.fieldData;
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


    let starting = recents.length - eventsLimit;
    let eventIndex;
    for (eventIndex = starting; eventIndex < recents.length; eventIndex++) {
        const event = recents[eventIndex];

        if (event.type === 'follower') {
            if (includeFollowers) {
                addEvent('follower', 'Follower', event.name);
            }
        } else if (event.type === 'redemption') {
            if (includeRedemptions) {
                addEvent('redemption', 'Redeemed', event.name);
            }
        } else if (event.type === 'subscriber') {
            if (event.amount === 'gift') {
                addEvent('sub', `Sub gift`, event.name);
            } else {
                addEvent('sub', `Sub X${event.amount}`, event.name);
            }

        } else if (event.type === 'host') {
            if (includeHosts && minHost <= event.amount) {
                addEvent('host', `Host ${event.amount.toLocaleString()}`, event.name);
            }
        } else if (event.type === 'cheer') {
            if (includeCheers && minCheer <= event.amount) {
                addEvent('cheer', `${event.amount.toLocaleString()} Bits`, event.name);
            }
        } else if (event.type === 'tip') {
            if (includeTips && minTip <= event.amount) {
                addEvent('tip', `${userCurrency.symbol}${event.amount.toLocaleString()}`, event.name);
            }
        } else if (event.type === 'raid') {
            if (includeRaids && minRaid <= event.amount) {
                addEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name);
            }
        }
    }
});

function addEvent(type, text, username) {
    totalEvents += 1;
    const element = `
    <div class="event-container" id="event-${totalEvents}">
        <div class="event-image event-${type}"></div>
        <div class="username-container">${username}</div>
       <div class="details-container">${text}</div>
    </div>`;
    $('.main-container').append(element);
    if (totalEvents > eventsLimit) {
        removeEvent(totalEvents - eventsLimit);
    }
}

function removeEvent(eventId) {
    $(`#event-${eventId}`).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(`#event-${eventId}`).remove();
    });
}