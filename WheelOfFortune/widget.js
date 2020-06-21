let theWheel, channelName, spinCommand, fieldData, cooldown, spins, segments = [];
const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};
const checkPrivileges = (data) => {
    let required = fieldData.privileges;
    let userState = {
        'mod': parseInt(data.tags.mod),
        'sub': parseInt(data.tags.subscriber),
        'vip': (data.tags.badges.indexOf("vip") !== -1),
        'badges': {
            'broadcaster': (data.userId === data.tags['room-id']),
        }
    };
    if (userState.badges.broadcaster) return true;
    else if (required === "mods" && userState.mod) return true;
    else if (required === "vips" && (userState.mod || userState.vip)) return true;
    else if (required === "subs" && (userState.mod || userState.vip || userState.sub)) return true;
    else if (required === "everybody") return true;
    else return false;
};

window.addEventListener('onEventReceived', function (obj) {
    const skippable = ["bot:counter", "event:test", "event:skip"]; //Array of events coming to widget that are not queued so they can come even queue is on hold
    if (skippable.indexOf(obj.detail.listener) !== -1) return;
    if (obj.detail.listener === "message") {
        let data = obj.detail.event.data;
        if (data["text"].toLowerCase() !== spinCommand.toLowerCase()) return;
        if (wheelSpinning) return;
        if (!checkPrivileges(data)) {
            return;
        }
        startSpin();
        setTimeout(
            function () {
                wheelSpinning = false; // set wheel not spinning, you can add callback to SE API here, to add points to `user`
                //var winningSegment = theWheel.getIndicatedSegment(); //- use this as reference
            }, cooldown * 1000 + 100);
    } else if (obj.detail.listener === fieldData.listener) {
        const data = obj.detail.event;
        if (data.amount < fieldData.minAmount) {
            SE_API.resumeQueue();
            return;
        }
        for (let i in segments) {
            if (data.message.toLowerCase().indexOf(segments[i].text.toLowerCase()) !== -1) {

                let chance = 1 / segments.length * (1 + (fieldData.keywordModifier + data.amount * fieldData.amountModifier) / 100)

                chance = Math.min(fieldData.maxChance / 100, chance);
                console.log(chance);
                if (Math.random() < chance) {
                    console.log(`Stopping at ${segments[i].text}`);
                    console.log(theWheel.segments);
                    let stopAt = theWheel.getRandomForSegment(i + 1);
                    theWheel.animation.stopAngle = stopAt;
                }
                break;
            }
        }

        startSpin();
        setTimeout(
            function () {
                wheelSpinning = false; // set wheel not spinning, you can add callback to SE API here, to add points to `user`
                //var winningSegment = theWheel.getIndicatedSegment(); //- use this as reference
            }, cooldown * 1000 + 100);

    } else {
        SE_API.resumeQueue();
    }

});

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj["detail"]["channel"]["username"];
    fieldData = obj.detail.fieldData;
    spinCommand = fieldData['spinCommand'];
    cooldown = fieldData['duration'];
    spins = fieldData['spins'];
    let tmpsegments = fieldData.segments.replace(" ", "").split(",");
    let tmpcolors = fieldData.segmentColors.toLowerCase().replace(" ", "").split(",");
    let weights = fieldData.segmentWeights.replace(" ", "").split(",");
    let sumWeights = 0;
    if (!weights.length) sumWeights = 360;
    for (let i in weights) {
        if (parseInt(weights[i])) {
            sumWeights += parseInt(weights[i]);
        }

    }
    if (fieldData.segments.split(",").length > weights.length) {
        sumWeights += 360 * (fieldData.segments.split(",").length - weights.length) / fieldData.segments.split(",").length;
    }


    for (let i in fieldData.segments.split(",")) {
        if (typeof tmpcolors[i] === "undefined") tmpcolors[i] = random_hex_color_code();
        if (tmpcolors[i].length < 2) tmpcolors[i] = random_hex_color_code();
        if (parseFloat(weights[i])) {
            segments.push({'text': tmpsegments[i], 'fillStyle': tmpcolors[i], 'size': 360 * weights[i] / sumWeights});
        } else {
            segments.push({'text': tmpsegments[i], 'fillStyle': tmpcolors[i]});
        }
    }
    console.log(segments);
    if (fieldData.displayImage) {
        theWheel = new Winwheel({
            'drawMode': 'image',
            'outerRadius': fieldData['wheelSize'] / 2,        // Set outer radius so wheel fits inside the background.
            'innerRadius': fieldData['innerRadius'],         // Make wheel hollow so segments don't go all way to center.
            'textFontSize': fieldData['textSize'],         // Set default font size for the segments.
            'textOrientation': 'vertical', // Make text vertial so goes down from the outside of wheel.
            'textAlignment': 'outer',    // Align text to outside of wheel.
            'numSegments': segments.length,         // Specify number of segments.
            'segments': segments,          // Define segments including colour and text.
            'pins':
                {
                    'number': fieldData['pins'],
                },
            'animation':           // Specify the animation to use.
                {
                    'type': 'spinToStop',
                    'duration': cooldown,     // Duration in seconds.
                    'spins': spins     // Default number of complete spins.
                    //'callbackFinished' : 'spinEnd()'
                }
        });
    } else {
        theWheel = new Winwheel({
            'outerRadius': fieldData['wheelSize'] / 2,        // Set outer radius so wheel fits inside the background.
            'innerRadius': fieldData['innerRadius'],         // Make wheel hollow so segments don't go all way to center.
            'textFontSize': fieldData['textSize'],         // Set default font size for the segments.
            'textOrientation': 'vertical', // Make text vertial so goes down from the outside of wheel.
            'textAlignment': 'outer',    // Align text to outside of wheel.
            'numSegments': segments.length,         // Specify number of segments.
            'segments': segments,          // Define segments including colour and text.
            'pins':
                {
                    'number': fieldData['pins'],
                },
            'animation':           // Specify the animation to use.
                {
                    'type': 'spinToStop',
                    'duration': cooldown,     // Duration in seconds.
                    'spins': spins     // Default number of complete spins.
                    //'callbackFinished' : 'spinEnd()'
                }
        });
    }
    let loadedImg = new Image();
    loadedImg.onload = function () {
        theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
        theWheel.draw();                    // Also call draw function to render the wheel.
    };
    loadedImg.src = fieldData.wheelImage;
});

// Vars used by the code in this page to do power controls.
let wheelSpinning = false;

function startSpin() {
    if (wheelSpinning === false) {
        theWheel.rotationAngle = 0;
        theWheel.stopAnimation(false);
        theWheel.animation.spins = spins;
        theWheel.startAnimation();
        wheelSpinning = true;
    }
}


