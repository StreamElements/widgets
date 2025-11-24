let apikey = "";
let voice = "Brian";
window.addEventListener('onWidgetLoad', async function (obj) {
    apikey = obj.detail.channel.apiToken;
    voice = obj.detail.fieldData.voice;
    volume = obj.detail.fieldData.volume / 100;
});

const playTTS = async (text, volume) => {
    return new Promise((resolve, reject) => {
        try {
            const url =  new URL("https://api.streamelements.com/kappa/v2/speech");
            url.searchParams.set("voice", voice);
            url.searchParams.set("text", text);
            url.searchParams.set("key", apikey);
            const audio = new Audio(url);
            audio.volume = volume;
            audio.play();
            audio.addEventListener('ended', () => {
                audio.remove();
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}



window.addEventListener("onEventReceived", async function (obj) {
    const listener = obj.detail.listener;
    if (listener === "message") {
        const { data: { text, nick, badges } } = obj.detail.event;
        const canPlay = badges.some(badge => badge.type === "broadcaster" || badge.type === "moderator");
        const message = `${nick} said: ${text.replace("!tts", "").trim()}`;
        if (canPlay && text.startsWith("!tts")) {
            await playTTS(message, volume);
        }
    }
});