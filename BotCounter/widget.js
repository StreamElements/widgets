let count = 0;
let container;
let counter = 'wins';
const threshold1 = 10;
const threshold2 = 30;

function setText(value) {
    container.text(value < 10 ? '0' + value : value);
    if (value > threshold2) {
        container.addClass('stage3');
    } else if (value > threshold1) {
        container.addClass('stage2');
        container.removeClass('stage3');
    } else {
        container.removeClass('stage3');
        container.removeClass('stage2');
    }
}

window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === 'bot:counter' && data.counter === counter) {
        setText(data.value);
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    container = $('.main-container');
    counter = obj.detail.fieldData.counterName;
    let apiKey = obj.detail.channel.apiToken;
    let channel = obj.detail.channel.username;
    container = $('.main-container');
    fetch(`//api.streamelements.com/kappa/v2/channels/${channel}/`, {}).then(response => response.json()).then(function (channelData) {
        let channelId = channelData._id;
        fetch(`//api.streamelements.com/kappa/v2/bot/${channelId}/counters/${counter}`, {

        }).then(response => response.json())
            .then(data => setText(data.value));
    });
});
