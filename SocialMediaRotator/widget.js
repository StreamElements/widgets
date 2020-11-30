// This widget contains content from @lx who made the Top Events Rotator
// (https://github.com/StreamElements/widgets/blob/master/TopEventsRotator/widget.js)
// which was an inspiration for this widget.
// Thank you very much @lx for helping me developing this widget.

let socials = [];

let timeline;
let slides;
let slideTime;

let next = 0;
let amount = 0;

let rotatorBehaviour;
let iterations;
let sleepTime;
let useIconColor;
let animationIn;
let animationOut;
let timeIn;
let timeDisplay;
let timeOut;
let timeInBetween;
let timeDelay;

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    rotatorBehaviour = fieldData.rotatorBehaviour;
    iterations = (rotatorBehaviour === "sleep") ? fieldData.iterations : 0;
    sleepTime = fieldData.sleepTime;
    useIconColor = fieldData.useIconColor;
    animationIn = fieldData.animationIn;
    animationOut = fieldData.animationOut;
    timeIn = fieldData.timeIn;
    timeDisplay = fieldData.timeDisplay;
    timeOut = fieldData.timeOut;
    timeInBetween = fieldData.timeInBetween;
    timeDelay = fieldData.timeDelay;
    slideTime = timeIn + timeDisplay + timeOut + timeInBetween;

    fillSocials(fieldData);
    init();
    startSlides();
});

function fillSocials(fieldData) {
    /* Change this if you wanted to add more socials */
    for (let i = 1; i <= 5; i++) {
        if (fieldData[`social${i}Enabled`] === "true") {
            socials.push(
                {
                    name: fieldData[`social${i}Name`],
                    icon: fieldData[`social${i}Icon`],
                    image: fieldData[`social${i}Image`],
                    color: fieldData[`social${i}Color`],
                    showImage: fieldData[`social${i}ShowImage`],
                    order: fieldData[`social${i}Order`]
                });
        }
    }
}

function init() {
    timeline = gsap.timeline({repeat: (iterations - 1), repeatDelay: timeDelay, paused: true, onComplete: sleep});

    let slide;
    let i = 1;
    for (var social of socials) {
        const usernameOrderStyle = (social.order === "socialfirst") ? 'order: -1;' : 'order: 1;';
        const colorStyle = (useIconColor === "icons") ? `color: ${social.color};` : '';

        slide = `<div class="slides" id="slide${i}">` +
            `${(social.showImage === "url")
                ? `<span class="slidesContent imageWrapper"><img class="image" src="${social.image}"></img></span>`
                : `<span class="slidesContent faWrapper fab fa-${social.icon}" style="color: ${social.color}"></span>`}` +
            `<span class="slidesContent username" style="${colorStyle} ${usernameOrderStyle}">${social.name}</span>` +
            `</div>`;

        $("#container").append(slide);

        timeline.set('#slide' + i, {
            visibility: 'visible',
            classList: 'slides animateIn',
            zIndex: i
        }, (i - 1) * slideTime);
        timeline.set('#slide' + i, {classList: 'slides animateOut'}, "+=" + (timeIn + timeDisplay));
        timeline.set('#slide' + i, {visibility: 'hidden', classList: 'slides'}, "+=" + timeOut);

        i++;
    }
    amount = i;
}

function startSlides() {
    if (timeline.progress() === 1) {
        timeline.restart();
    } else {
        timeline.play();
    }
}

function sleep() {
    if (rotatorBehaviour === "sleep") {
        setTimeout(startSlides, (sleepTime * 1000));
    }
}
