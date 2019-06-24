let fieldData;
let currentSlide = 0;

let changeSlide = () => {
    let slides = $(".slide");

    if (currentSlide < slides.length - 1) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    slides.css("opacity",0);
    $(slides[currentSlide]).css("opacity", 1);

};

function slideShow() {
    console.log("In slideshow");
    var tl = new TimelineMax({repeat: -1});
    tl.timeScale(1);
    tl.call(function () {
        $(".main-container").removeClass("{{animationIn}}").addClass("{{animationOut}}");
    }, null, null, `+=${fieldData.showTime + $(".slide").length}`);

    tl.call(function () {
        $(".main-container").removeClass("{{animationOut}}").addClass("{{animationIn}}");
        changeSlide();
    }, null, null, `+=${fieldData.hideTime}`);


}

let setPositions = () => {
    switch (fieldData.layout) {
        case "titleTopLabelBottom":
            $(".title").css("top", "0px");
            $(".label").css("bottom", "0px");
            break;
        case "titleTopLabelHidden":
            $(".title").css("top", "0px");
            $(".label").css("opacity", 0);
            break;
        case "titleBottomLabelHidden":
            $(".title").css("bottom", "0px");
            $(".label").css("opacity", 0);
            break;
        case "titleBottomLabelTop":
            $(".title").css("bottom", "0px");
            $(".label").css("top", "0px");
            break;
        case "labelTopTitleHidden":
            $(".title").css("opacity", 0);
            $(".label").css("top", "0px");
            break;
        case "labelBottomTitleHidden":
            $(".title").css("opacity", 0);
            $(".label").css("bottom", "0px");
            break;
        case "allHidden":
            $(".title").css("opacity", 0);
            $(".label").css("opacity", 0);
            break;

    }
};

$(".main-container").hide();
window.addEventListener('onWidgetLoad', function (obj) {

    console.log(obj.detail);
    fieldData = obj.detail.fieldData;


    let channels = fieldData.channel.split(",");
    for (let i in channels) {
        let channelId = channels[i];
        let param;
        if (fieldData.type === "channel") {
            param = `?id=${channelId}`;
        } else {
            param = `?user=${channelId}`
        }
        console.log(channelId);
        fetch("https://decapi.me/youtube/latest_video" + param).then(response => response.text().then(text => {
            let videoId = text.split("/").pop();
            let title = text.split(" - https://youtu.be").shift();
            $(".main-container").append(`<div class="slide" style="background-image:url(https://img.youtube.com/vi/${videoId}/${fieldData.resolution}.jpg)">
                <div class="title">${title}</div>
                <div class="label">{{label}}</div>
            </div>`);


        }))
        ;

    }
    setTimeout(() => {
        setPositions();
        $(".main-container").show().addClass("{{animationIn}}");
        slideShow();
    }, 3000);


});

