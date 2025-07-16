// twitch and youtube message events
var eventList = ["message", "youtube#liveChatMessage"];
var cooling = null;

var audio, coolDown;
// on widget load, apply settings variables and load sound file
window.addEventListener('onWidgetLoad', (obj) => {
    const {fieldData} = obj.detail;
    audio = new Audio(fieldData.dingSound);
    audio.volume = fieldData.dingVolume / 100;
    audio.autoplay = false;
    coolDown = fieldData.coolDown;
})
// on message recieved, stop any existing ding, play ding, and apply cooldown
// message events are ignored entirely while on cooldown
window.addEventListener('onEventReceived', (obj) => {
    if (cooling === null) {
        if (eventList.includes(obj.detail.listener))
        {
            if (!audio.paused)
            {
                audio.pause();
                audio.currentTime = 0;
            }
            audio.play();
            cooling = setTimeout(() => {cooling = null;}, coolDown * 1000)
        }
    }
});
