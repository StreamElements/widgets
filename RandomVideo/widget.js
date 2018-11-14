// Add urls here (array of strings)
const videos = [
];

window.addEventListener('onWidgetLoad', () => {
    document.getElementById('video').src = getRandom(videos);
    document.getElementById('video').play();
});

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
