
// variations colors can contain any CSS filter with proper value
variations = [
    {
        "type": "follower",
        "amount": 0,
        "colors": {}
    },
    {
        "type": "subscriber",
        "amount": 0,
        "colors": {
            "grayscale": 1
        }
    },
    {
        "type": "subscriber",
        "amount": 3,
        "colors": {
            "hue-rotate": "40deg"
        }
    },
    {
        "type": "subscriber",
        "amount": 6,
        "colors": {
            "hue-rotate": "100deg"
        }
    },
    {
        "type": "subscriber",
        "amount": 9,
        "colors": {
            "hue-rotate": "220deg"
        }
    },
    {
        "type": "subscriber",
        "amount": 12,
        "colors": {
            "hue-rotate": "340deg",
            "saturate": 5
        }
    },
    {
        "type": "cheer",
        "amount": 100,
        "colors": {
            "hue-rotate": "190deg"
        }
    },
    {
        "type": "tip",
        "amount": 1,
        "colors": {
            "hue-rotate": "300deg",
            "saturate": 6
        }
    }

];

parseEvent = (event) => {
    let eventsTmp = variations.filter((element) => {
        if (event.type !== "follower") {
            return element.type === event.type && element.amount <= event.amount;
        } else
            return element.type === event.type;
    });
    if (eventsTmp.length) {
        let variation = eventsTmp.slice(-1)[0];
        let filters = [];
        for (let i in variation.colors) {
            filters.push(`${i}(${variation.colors[i]})`);
        }
        document.getElementById("main-container").style.filter = filters.join(" ");
    }
};

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
        return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const event = obj.detail.event;
    if (obj.detail.listener.indexOf("-latest") !== -1) {
        parseEvent(event)
    }


});

window.addEventListener('onWidgetLoad', function (obj) {
    let recents = obj.detail.recents;
    recents.sort(function (a, b) {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
    parseEvent(recents.split(-1)[0]);
});
