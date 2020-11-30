// This widget contains content from @lx who made the Top Events Rotator
// (https://github.com/StreamElements/widgets/blob/master/TopEventsRotator/widget.js)
// which was an inspiration for this widget.
// Thank you very much @lx for helping me developing this widget.

let elements = [
    {
        name:      "{{el1Name}}",
        icon:      "{{el1Icon}}",
        link:      "{{el1IconLink}}",
        color:     "{{el1Color}}",
        showImage: "{{el1IconShow}}",
        order:     "{{icon1SocialOrder}}"
    },
    {
        name:      "{{el2Name}}",
        icon:      "{{el2Icon}}",
        link:      "{{el2IconLink}}",
        color:     "{{el2Color}}",
        showImage: "{{el2IconShow}}",
        order:     "{{icon2SocialOrder}}"
    },
    {
        name:      "{{el3Name}}",
        icon:      "{{el3Icon}}",
        link:      "{{el3IconLink}}",
        color:     "{{el3Color}}",
        showImage: "{{el3IconShow}}",
        order:     "{{icon3SocialOrder}}"
    },
    {
        name:      "{{el4Name}}",
        icon:      "{{el4Icon}}",
        link:      "{{el4IconLink}}",
        color:     "{{el4Color}}",
        showImage: "{{el4IconShow}}",
        order:     "{{icon4SocialOrder}}"
    },
    /* To use more than 4 icons copy this example
    {
        name: "exampleName",
      icon: "discord",
      link: "https://uc45c92bdd0662d16394d3c6af22.previews.dropboxusercontent.com/p/thumb/AAbkIz3hWBqFshHVDB6EJGzzjkB4c1qXytULt6Q_ptoZ_KJQ5oxLXOgwuDZxHtMuGSbRmby2wAgiKWGBH727ZJS5lZmUsMFEt0oObn-BwVWR8cDYyC80QgjAq58K6pYdswGqqWooE0AkF5mV4nVkaXuxzTyZ_CJaCL_hIf8JTIWkBSLoQlv8Cn93TwdQx7UG7tEJ8gO_-IybOm0hlyq3-SJwP8MbL3VqWFv4P9w1yR-s4I9H99m09gZXkzDtm8fgRFni2XapqtNimJ15JRo8bZ2x4hbp8Jfv6BInCj9-wNNhNevQkKQPMHQZXRQeuUFojqguDKcPytXyI6I4oR-dKbkh/p.png?fv_content=true&size_mode=5",
      color: "#7289DA",
      showImage: "fontawesome", //none, fontawesome, url
      order: "iconfirst" //iconfirst, socialfirst
    },*/
];

let timeline;
let slides;
let slideTime;

let next   = 0;
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

window.addEventListener('onWidgetLoad', function(obj)
{
    const fieldData  = obj.detail.fieldData;
    rotatorBehaviour = fieldData.rotatorBehaviour;
    iterations       = (rotatorBehaviour === "sleep") ? fieldData.iterations : 0;
    sleepTime        = fieldData.sleepTime;
    useIconColor     = fieldData.useIconColor;
    animationIn      = fieldData.animationIn;
    animationOut     = fieldData.animationOut;
    timeIn           = fieldData.timeIn;
    timeDisplay      = fieldData.timeDisplay;
    timeOut          = fieldData.timeOut;
    timeInBetween    = fieldData.timeInBetween;
    timeDelay        = fieldData.timeDelay;
    slideTime        = timeIn + timeDisplay + timeOut + timeInBetween;

    init();
    startSlides();
});

function init()
{
    timeline = gsap.timeline({ repeat: (iterations - 1), repeatDelay: (timeDelay / 1000), paused: true, onComplete: sleep });

    let slide;
    let i = 1;
    for(var element of elements)
    {
        const colorStyle = (useIconColor === "icons") ? `color: ${element.color};` : '';

        slide = `<div class="slides" id="slide${i}">`;
        if(element.order     === "socialfirst") { slide += `<span class="slidesContent username" style="${colorStyle}">${element.name}</span>`; }
        if(element.showImage === "url")         { slide += `<span class="slidesContent imageWrapper"><img class="image" src="${element.link}"></img></span>`; }
        else if(element.showImage === "fontawesome") { slide += `<span class="slidesContent faWrapper fab fa-${element.icon}" style="color: ${element.color}"></span>`; }
        if(element.order     === "iconfirst")   { slide += `<span class="slidesContent username" style="${colorStyle}">${element.name}</span>`; }
        slide += '</div>';

        $("#container").append(slide);

        timeline.set('#slide' + i, { visibility: 'visible', classList: 'slides animateIn', zIndex: i }, (i - 1) * (slideTime / 1000));
        timeline.set('#slide' + i, {                        classList: 'slides animateOut'           }, "+=" + (timeIn + timeDisplay) / 1000);
        timeline.set('#slide' + i, { visibility: 'hidden',  classList: 'slides'                      }, "+=" + (timeOut / 1000));

        i++;
    }
    amount = i;
}

function startSlides()
{
    if(timeline.progress() === 1) { timeline.restart(); }
    else { timeline.play(); }
}

function sleep()
{
    if(rotatorBehaviour === "sleep")
    {
        setTimeout(startSlides, (sleepTime * 1000));
    }
}
