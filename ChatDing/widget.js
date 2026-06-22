// twitch and youtube message events
let eventList = ["message", "youtube#liveChatMessage"];
let cooling = null;
let audio = new Audio("{dingSound}");
audio.volume = parseInt("{dingVolume}") / 100;
let cooldown = parseInt("{coolDown}") * 1000;

// on message recieved, stop any existing ding, play ding, and apply cooldown
// message events are ignored entirely while on cooldown
window.addEventListener('onEventReceived', function (obj) {
    if (!eventList.includes(obj.detail.listener)) return;
    if (cooling !== null) return;
    if (!audio.paused)
        {
            audio.pause();
            audio.currentTime = 0;
        }
    console.log("ChatDing");
    audio.play();
    cooling = setTimeout(() => {cooling = null;}, cooldown);
});
