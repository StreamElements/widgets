let segments = [                               // font size and test colour overridden on backrupt segments.
    {'fillStyle': '#ee1c24', 'text': '300'},
    {'fillStyle': '#3cb878', 'text': '450'},
    {'fillStyle': '#f6989d', 'text': '600'},
    {'fillStyle': '#00aef0', 'text': '750'},
    {'fillStyle': '#f26522', 'text': '500'},
    {'fillStyle': '#000000', 'text': 'BANKRUPT', 'textFontSize': 16, 'textFillStyle': '#ffffff'},
    {'fillStyle': '#e70697', 'text': '3000'},
    {'fillStyle': '#fff200', 'text': '600'},
    {'fillStyle': '#f6989d', 'text': '700'},
    {'fillStyle': '#ee1c24', 'text': '350'},
    {'fillStyle': '#3cb878', 'text': '500'},
    {'fillStyle': '#f26522', 'text': '800'},
    {'fillStyle': '#a186be', 'text': '300'},
    {'fillStyle': '#fff200', 'text': '400'},
    {'fillStyle': '#00aef0', 'text': '650'},
    {'fillStyle': '#ee1c24', 'text': '1000'},
    {'fillStyle': '#f6989d', 'text': '500'},
    {'fillStyle': '#f26522', 'text': '400'},
    {'fillStyle': '#3cb878', 'text': '900'},
    {'fillStyle': '#000000', 'text': 'BANKRUPT', 'textFontSize': 16, 'textFillStyle': '#ffffff'},
    {'fillStyle': '#a186be', 'text': '600'},
    {'fillStyle': '#fff200', 'text': '700'},
    {'fillStyle': '#00aef0', 'text': '800'},
    {'fillStyle': '#ffffff', 'text': 'LOOSE TURN', 'textFontSize': 12}
];
let theWheel, channelName, spinCommand, accessLevel, cooldown, spins;
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    data['tags']['mod'] = parseInt(data['tags']['mod']);
    let message = data["text"];
    let user = data["nick"];
    if (message.toLowerCase() !== spinCommand.toLowerCase()) return;
    if (wheelSpinning) return;
    if (accessLevel === 'broadcaster' && channelName !== user) return;
    if (accessLevel === 'mods' && !(channelName === user || data['tags']['mod'])) return;

    startSpin();
    setTimeout(
        function () {
            wheelSpinning = false; // set wheel not spinning, you can add callback to SE API here, to add points to `user`
            //var winningSegment = theWheel.getIndicatedSegment(); //- use this as reference
        }, cooldown * 1000 + 100);
});

window.addEventListener('onWidgetLoad', function (obj) {
    channelName = obj["detail"]["channel"]["username"];
    const fieldData = obj.detail.fieldData;
    spinCommand = fieldData['spinCommand'];
    accessLevel = fieldData['access'];
    cooldown = fieldData['duration'];
    spins = fieldData['spins'];
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


