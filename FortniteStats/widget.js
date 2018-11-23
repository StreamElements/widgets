let username, gameType, platform, timeframe;
let scale = Math.min($('.main-container').width() / 411, $('.main-container').height() / 116);
$('.stat-container').css('transform', 'scale(' + scale + ')');

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    username = fieldData.username;
    gameType = fieldData.gameType;
    platform = fieldData.platform;
    timeframe = fieldData.timeframe;
    if (username){
        getData();
    }
});

function getData() {
    $.getJSON("https://fortnite-public-api.theapinetwork.com/prod09/users/id?username=" + username, function (userData) {

        if (userData.uid) {
            $.getJSON("https://fortnite-public-api.theapinetwork.com/prod09/users/public/br_stats?user_id=" + userData.uid + "&platform=" + platform + "&window=" + timeframe, function (data) {
                let scores=data["stats"];
                $("#stats-games").text(scores["matchesplayed_"+gameType]);
                $("#stats-winrate").text(scores["winrate_"+gameType]+"%");
                $("#stats-kills").text(scores["kills_"+gameType]);
                $("#stats-wins").text("(" + scores["placetop1_"+gameType] + ")");
                $("#stats-top10").text(scores["placetop10_"+gameType]);
                $("#stats-top25").text(scores["placetop25_"+gameType]);
                $("#stats-kd").text(scores["kd_"+gameType]);
                //$("#stats-time").text(secondsToString(scores["minutesplayed_"+gameType]));

            });
        }
    });
    setTimeout(function () {
        getData()
    }, 30000);
}



function secondsToString(seconds) {

    let numdays = Math.floor((seconds % 31536000) / 86400);
    let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    let numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return numdays + "d " + numhours + ":" + pad(numminutes, 2) + ":" + pad(numseconds, 2);

}

function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

