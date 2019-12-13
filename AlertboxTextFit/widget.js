let height = $(".holder").height();
let resize = () => {
    if ("{{dynamicFontSize}}" === "dynamic") {
        setTimeout(() => {
            fitty('.main-container', {
                minSize: 12,
                maxSize: height
            });
        }, 5);
    }
};
setTimeout(() => {
    const name = "{name}", amount = {amount}, currency = "{currency}", message = "{message}";
    //let text="{announcement}".replace("[","").replace("]","")
    let text = "{announcement}".replace("[", "<span class=\"highlight\">").replace("]", "</span>")
    $(".main-container").html(text);
    resize();
}, 50);

let vid = document.getElementById("video");
vid.volume = {videoVolume};
vid.oncanplay = function () {
    vid.play();

    setTimeout(() => {

        $(".holder").removeClass("invisible").addClass("{animationIn}");
    }, {appearTime} * 1000)

    setTimeout(() => {
        $(".holder").removeClass("{animationIn}").addClass("{animationOut}");
    }, {disappearTime} * 1000)
};