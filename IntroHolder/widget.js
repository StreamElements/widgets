let minutes = 0.2;
//Total time of countdown timer

let includeIntro = true;
// true - play intro included in countdown sequence
// false - play intro after countdown is complete

let closeAfterIntro = true;
// true - put blinders back on position when intro is complete
// false - pause at last frame of intro video

let hideCounter = true;
//Hide counter after countdown is complete

let showMessage = true;
// Show message box after countdown is complete


let start = new Date();
let isPlaying = false;

let duration;
// Waiting to video load
var vid = document.getElementById("intro");
window.setInterval(function (t) {
    if (vid.readyState > 0) {
        duration = vid.duration;
        clearInterval(t);
    }
}, 500);
$("document").ready(function () {


    let timeUntil = start.getTime() + minutes * 60000;
    let finished = false;
    $('#countdown').countdown(timeUntil, {elapse: true}).on('update.countdown', function (event) {
        if (!event.elapsed || event.offset.totalSeconds === 0) {
            $(this).html(event.strftime('%H:%M:%S'));
        }

        if (!finished) {
            if (includeIntro && event.offset.totalSeconds < duration && !isPlaying) {
                console.log("Playing intro");
                isPlaying = true;
                $(".blinder").addClass("hideBlinder");
                vid.play();
            }

            if (event.elapsed) {
                if (hideCounter) {
                    $(this).html('');
                }
                if (includeIntro || event.offset.totalSeconds > duration) {
                    if (showMessage) {
                        $("#message").css("opacity", 1);
                    }
                    if (closeAfterIntro) {
                        $(".blinder").removeClass("hideBlinder");
                    }
                    finished = true;
                }

                if (!includeIntro && !isPlaying) {
                    isPlaying = true;
                    $(".blinder").addClass("hideBlinder");
                    vid.play();
                }


            }


        }
    });
});