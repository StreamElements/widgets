let user, cmd, inT, outT, duracion, isVideo, isCarrusel;

let slides, slidesCount, maxLeft, delay = 3000;
let current = 0, carruselOn = false;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
        return;
    }
    let listener = obj.detail.listener;
    if (listener !== "message") return;
    let data = obj.detail.event.data;
    if(data.text.trim() !== cmd) return
    instaDataByUser(user);
});

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    user         = fieldData["username"];
    cmd          = fieldData["command"];
    inT          = fieldData["inT"];
    outT         = fieldData["outT"];
    duracion     = fieldData["duration"];
    isVideo      = fieldData["showVideo"];
    isCarrusel   = fieldData["showCar"];
    isRandom     = fieldData["isRandom"];
    delay        = fieldData["durationCarrusel"];
    delay *= 1000;
    console.log(isRandom);
});

function getLastPost(data, i = 0) {

    if(data === undefined) return;
    if(i<0) i = 0;
    if(i>12) i = 12;
    let imgs = (data.edge_owner_to_timeline_media || data.edge_hashtag_to_media).edges;
    if(i >= imgs.length) i = imgs.length - 1;
    let url = "https://www.instagram.com/p/" + imgs[i].node.shortcode;
    let tipo, image, carrusel, video;
    let txt = imgs[i].node.edge_media_to_caption.edges[0].node.text;
    switch (imgs[i].node.__typename) {
        case "GraphSidecar":
            tipo = "carrusel"
            image = imgs[i].node.display_url;
            carrusel = imgs[i].node.edge_sidecar_to_children.edges;
            break;
        case "GraphVideo":
            tipo = "video";
            image = imgs[i].node.thumbnail_src;
            video = imgs[i].node.video_url;
            break;
        default:
            tipo = 'imagen';
            image = imgs[i].node.display_url;
            ;
    }
    console.log(data);
    showLastPost(tipo, video, image, carrusel, txt);
}

function showLastPost(tipo, video, img, carrusel, txt) {
    console.log('show');
    $("#cont")
        .queue(function() {
            console.log(tipo);
            switch(tipo) {
                case 'video':
                    if(isVideo) {
                        $("#img").html("");
                        $("#video")
                            .html("<video src=\"" + video + "\" autoplay poster=\"" +img +"\" class='show round-sq'>Tu navegador no admite el elemento <code>video</code>.</video>");
                    } else {
                        $("#img").html("<img class='show round-sq' src=\"" + img + "\">");
                    }
                    break;
                case 'carrusel':
                    if(isCarrusel) {
                        carruselOn = true;
                        $("#img").html("<div class=carousel><div class=slides id=s></div></div>");
                        for(let c of carrusel) {
                            let imgC = c.node.display_url;
                            $("#s").append("<img class='slide round-sq' src=\"" + imgC + "\">");
                        }
                        carr();
                        break;
                    } else {
                        $("#img").html("<img class='show round-sq' src=\"" + img + "\">");
                    }
                    break;
                default:
                    $("#img").html("<img class='show round-sq' src=\"" + img + "\">");
                    break;
            }
            $("#txt").html(txt);
            /*resize_to_fit();
            $("#imgen").html("<img class=imgDisp src=\"" + imgUrl + "\">");*/
            $(this).removeClass(outT + "Out initialHide");
            $(this).addClass(inT + "In");
            $(this).dequeue();
        })
        .delay(duracion * 1000)
        .queue(function() {
            $("#video").html('');
            carruselOn = false;
            $(this).removeClass(inT  + "In");
            $(this).addClass(outT  + "Out");
            $(this).dequeue();
        });
}

function carr() {
    slides = document.querySelector(".slides");
    slidesCount = slides.childElementCount;
    maxLeft = (slidesCount - 1) * 100 * -1;
    console.log(slidesCount);
    let autoChange = setInterval(changeSlide, delay);
    const restart = function () {
        clearInterval(autoChange);
        if(carruselOn) autoChange = setInterval(changeSlide, delay);
    };
}

function changeSlide(next = true) {
    if (next) {
        current += current > maxLeft ? -100 : current * -1;
    } else {
        current = current < 0 ? current + 100 : maxLeft;
    }
    slides.style.left = current + "%";
}

async function instaDataByUser(username) {
    let url = 'https://www.instagram.com/' + username;
    $.get(url, function (data) {
        try {
            data = data.split("window._sharedData = ")[1].split("<\/script>")[0];
        } catch (e) {
            console.error("Instagram Error: It seems that the profile you are trying to recover has age restrictions");
            return;
        }
        data = JSON.parse(data.substr(0, data.length - 1));
        data = data.entry_data.ProfilePage;
        if (typeof data === "undefined") {
            console.error(
                "Instagram Error: It appears that YOUR network has been temporarily banned due to too many requests"
            );
            return;
        }
        data = data[0].graphql.user || data[0].graphql.hashtag;
        let i = isRandom === 'last' ? 0 : Math.floor(Math.random() * 12);
        getLastPost(data, i)
    }).fail(function (e) {
        console.error("Instagram Feed: The user could not be retrieved. Instagram status: ", e.status);
    });
}
