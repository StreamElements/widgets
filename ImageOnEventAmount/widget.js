let type = "follower"; //follower/subscriber/tip/cheer
let period = "session"; //session/week/month/alltime

// images - list of images for each step of amount
let images = {
    1: "https://i.imgur.com/qo9v0jk.jpg",
    5: "https://i.imgur.com/wxLJrJ8.jpg",
    10: "https://i.imgur.com/VVAIi4m.jpg",
};


let numberKey = "amount";
if (type === "follower" || type === "subscriber") {
    numberKey = "count";
}
let dataKey = `${type}-${period}`;
let currentImage;
window.addEventListener('onSessionUpdate', e => {
    const data = e.detail.session;
    amount = data[dataKey][numberKey];
    checkImage(amount)
});

window.addEventListener('onWidgetLoad', function (obj) {
    let data = obj["detail"]["session"]["data"];
    amount = data[dataKey][numberKey];
    checkImage(amount)
});

function findKey(number) {
    let bestKey;
    for (let key in images) {
        if (key > number) break;
        if (images.hasOwnProperty(key)) {
            bestKey = key;
        }
    }
    return bestKey === undefined ? undefined : images[bestKey];
}

function checkImage(amount) {
    let newImage = findKey(amount);

    if (newImage !== currentImage) {
        currentImage = newImage;
        $(".main-container").css('background-image', `url("${newImage}")`);
    }
}