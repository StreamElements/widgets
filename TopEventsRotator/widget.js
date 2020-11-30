let fieldData, sessionData, timeout, timeline;
let height;
const slideTime=parseInt("{cycleTime}");
const resize = () => {
    if ("{{dynamicFontSize}}" === "dynamic") {
        console.log(height);
        setTimeout(() => {
            fitty('.dynamic', {
                minSize: 12,
                maxSize: height
            });
        }, 5);
    }
};
let prepareField = (field) => {
    if (typeof field === "undefined") return;
    if (typeof field.data("template") === "undefined") {
        field.data("template", field.html());
    }
    if (field.html()==="") {
        field.parent().remove();
        return;
    }

    field.html(field.data('template').replace(/{([\w\.\-]*)}/g, function (m, key) {
        key = key.split(".");

        if (!sessionData.hasOwnProperty(key[0])) return "";
        let data = sessionData[key[0]]

        if (!data.hasOwnProperty(key[1])) return "";
        if (data[key[1]]===0) return "";
        return data[key[1]];
    }));

}
window.addEventListener('onSessionUpdate', (obj) => {
    sessionData = obj.detail.session;
    $(".dynamic").each(function (index) {
        prepareField($(this));
    });
    resize();
});

const animate = () => {
    var slides = $('.slide');
    timeline = new TimelineMax({repeat:-1, repeatDelay:{hideAfter}});
    timeline.append(TweenMax.staggerTo(slides, 1, {css:{autoAlpha:1}, repeat:1, yoyo:true, repeatDelay:slideTime-2}, slideTime))
}


window.addEventListener('onWidgetLoad', function (obj) {
    sessionData = obj.detail.session.data;
    fieldData = obj.detail.fieldData;
    $(".dynamic").each(function (index) {
        prepareField($(this));
    });
    animate();
    resize();
});
$('.dynamic').each(function() {
    var $this = $(this);
    if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
        $this.parent().parent().remove();
});
height=$(".slide").height();
$(".image").width(height);
$(".text").width($(".slide").width()-height)

