// Add urls here (array of strings)
const videos = [
];

window.addEventListener('onWidgetLoad', function(obj) {
    document.getElementById('video').src = getRandom(videos);
    let promise = document.getElementById('video').play();
    if (promise !== undefined) {
        promise.then(_ => {
            // Autoplay started!
        }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
            document.getElementById('video').muted = true;
            document.getElementById('video').play();
        });
    }
});

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
