let count = 0;
let container;
const jwt = '';
const counter = 'wins';
const channel = '';
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

window.addEventListener('onEventReceived', function(obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === 'bot:counter' && data.counter === counter) {
        setText(data.value);
    }
});

window.addEventListener('onWidgetLoad', function() {
    container = $('.main-container');
    fetch(`//api.streamelements.com/kappa/v2/bot/${channel}/counters/${counter}`, {
        headers:{
            'Authorization': `Bearer ${jwt}`
        }
    }).then(response => response.json())
        .then(data => setText(data.value));
});
