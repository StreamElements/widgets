let userCurrency;
let userCurrency;
let fieldData;
let animation;
let minAmount = 20;
let displayTime;
let displayGifter;
let subsQueue = {};
let tmpQueue = [];
let skippable = ["bot:counter", "event:test", "event:skip", "message"];
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    console.log(obj.detail);
    const data = obj.detail.event;
    console.log(`RECEIVED ${listener}`);
    if (skippable.indexOf(listener) !== -1) return;

    if (listener !== 'subscriber-latest') {
        console.log("RESUMING NON SUB");
        SE_API.resumeQueue();
        return;
    }
    if (data.bulkGifted !== true && !data.gifted) {
        console.log("RESUMING NON GIFT");
        SE_API.resumeQueue();
        return;
    }

    if (data.amount >= minAmount && data.name === data.sender) {
        // Initial event for community gift
        subsQueue[data.displayName] = {
            total: data['amount'],
            subs: []
        }
        console.log("RESUMING - INTRO MESSAGE");

    } else if (typeof subsQueue[data.sender] !== "undefined") {
        // Adding new sub
        subsQueue[data.sender].subs.push(data.name);
        if (subsQueue[data.sender].total <= subsQueue[data.sender].subs.length) {
            console.log("Playing animation");
            displaySubs(subsQueue[data.sender].subs, data.sender)
            delete subsQueue[data.sender];
            return;
        }

    }
    console.log("RESUMING - Part of subbomb");
    SE_API.resumeQueue();
});

function displaySubs(subs, gifter) {
    let delayTime = displayTime;
    if (animation === "train") {
        delayTime = displayTime * (subs.length);
    }
    $('.main-container').queue(function () {
        let soundAlert = new Audio(fieldData['alertUrl']);
        soundAlert.volume = parseInt(fieldData['volume']) / 100;
        soundAlert.play();
        if (displayGifter) {
            let amount = subs.length;
            $(this).html(`<div class="gifter">${gifter} gifted ${amount} subs to community!</div>`);
        } else {
            $(this).html('');
        }
        if (animation === "randomPlaces") {
            subs.forEach(function (user) {
                let top = Math.floor((Math.random() * 900) + 1);
                let left = Math.floor((Math.random() * 1800) + 1);
                let rotate = Math.floor((Math.random() * 80)) - 40;
                let time = Math.floor((Math.random() * 3000) + 100);
                let element = `<div class="subs" style="top:${top}px;left:${left}px;transform:rotate(${rotate}deg)"><div class="animated {animationIn}">${user}</div></div>`;
                setTimeout(function () {
                    $('.main-container').append(element);
                }, time);
            });
            setTimeout(function () {
                    $('.animated').removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                        $('.subs').remove();
                        $(this).dequeue();
                    });
                },
                displayTime * 1000 - 1000);
        } else if (animation === "explosion") {

            subs.forEach(function (user) {
                let top = Math.floor((Math.random() * 900) + 1);
                let left = Math.floor((Math.random() * 1800) + 1);
                let rotate = Math.floor((Math.random() * 80)) - 40;
                let time = Math.floor((Math.random() * 3000) + 100)
                let element = `<div class="subs explosion" style="transform:rotate(${rotate}deg)"><div class="animated {animationIn}">${user}</div></div>`;
                $('.main-container').append(element);
                setTimeout(function () {
                    $(".explosion").each(function () {
                        let top = Math.floor((Math.random() * 900) + 1);
                        let left = Math.floor((Math.random() * 1800) + 1);
                        $(this).css('top', top);
                        $(this).css('left', left);
                    });
                }, 500);
            });
            setTimeout(function () {
                    $('.animated').removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                        $('.subs').remove();
                        $(this).dequeue();
                    });
                },
                displayTime * 1000 - 1000);
        } else if (animation === "fall") {
            subs.forEach(function (user, index) {

                let top = Math.floor((Math.random() * 900) + 1);
                let left = Math.floor((Math.random() * 1800) + 1);
                let rotate = Math.floor((Math.random() * 80)) - 40;
                let time = Math.floor((Math.random() * 3000) + 100)
                let element = `<div id="s${index}" class="subs rainfall" style="top:-50px;left:${left}px;transform:rotate(${rotate}deg)"><div class="animated {animationIn}">${user}</div></div>`;
                $('.main-container').append(element);
                setTimeout(function () {
                    $('#s' + index).css('top', '1300px');
                    console.log(index)
                }, time);

            });
            setTimeout(function () {
                    $('.animated').removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                        $('.subs').remove();
                        $(this).dequeue();
                    });
                },
                displayTime * 1000 - 1000);
        } else if (animation === "train") {

            let amount = subs.length;
            $('.main-container').append(`<div class="tracks" style="animation-duration:${delayTime}s">${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | ${gifter} | ${amount} | </div>`);
            $('.main-container').append(`<div class="train" style="animation-duration:${delayTime}s"><div class="locomotive">${gifter}</div></div>`);
            subs.forEach(function (user, index) {
                let number = index + 1;
                $('.train').append(`<div class="wagon">${number} ${user}</div>`);
            });
            delayTime = delayTime / 2 + displayTime * 4;
        }
        setTimeout(function () {
                $(".gifter").fadeOut();
            },
            delayTime * 1000 - 1000);

        setTimeout(function () {
            console.log("RESUME: End of animation");
            SE_API.resumeQueue();
            $(".main-container").html('');
        }, delayTime * 1000);
        $(this).delay(delayTime * 1000).dequeue();
    });

}

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj['detail']['fieldData'];
    userCurrency = obj.detail.currency;
    animation = obj.detail.fieldData.animation;
    animationIn = obj.detail.fieldData.animationIn;
    animationOut = obj.detail.fieldData.animationOut;
    minAmount = obj.detail.fieldData.minAmount;
    displayTime = obj.detail.fieldData.displayTime;
    displayGifter = obj.detail.fieldData.displayGifter;
});
