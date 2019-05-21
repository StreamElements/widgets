let fieldData;

function slideShow() {
    console.log("In slideshow");
    var tl = new TimelineMax({repeat: -1});
    tl.timeScale(1);
    tl.call(function () {
        $(".main-container").removeClass("{{animationIn}}").addClass("{{animationOut}}");
    }, null, null, `+=${fieldData.showTime}`);
    tl.call(function () {
        $(".main-container").removeClass("{{animationOut}}").addClass("{{animationIn}}");
    }, null, null, `+=${fieldData.hideTime}`);

}

$(".main-container").hide();
window.addEventListener('onWidgetLoad', function (obj) {

    console.log(obj.detail);
    fieldData = obj.detail.fieldData;
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

    let param;
    if (fieldData.type === "channel") {
        param = `?id=${fieldData.channel}`;
    } else {
        param = `?user=${fieldData.channel}`
    }

    fetch("https://decapi.me/youtube/latest_video" + param).then(response => response.text().then(text => {
        let videoId = text.split("/").pop();
        let title = text.split(" - https://youtu.be").shift();
        $(".title").text(title);
        $(".main-container").css("background-image", `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`);
        setTimeout(() => {
            $(".main-container").show().addClass("{{animationIn}}");
            slideShow();
        }, 3000);

    }))
    ;
});

