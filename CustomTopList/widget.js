//
// This widget is to show how to read data from SE API by Overlay Widget
// Remember that endpoints can have different access levels:
// - No authorization needed (like /channels/channelName)
// - apikey Auth (like /activities endpoint)
// - JWT token (DO NOT USE THAT WITHIN OVERLAY AS THIS CAN ALLOW SOMEBODY TO DO A LOT OF HARM TO YOUR ACCOUNT - REMOVE OVERLAYS, CLEAR TIP DATA, FAKE TIPS AND SO ON)
//

let apiKey;
let channelName;
let channelId;
let typeQ, periodQ, limitQ, offsetQ;
window.addEventListener('onSessionUpdate', function () {
    displayPeople();
});
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    apiKey = obj.detail.channel.apiToken;
    channelName = obj.detail.channel.username;

    //Custom names to override templating variables applied automatically
    typeQ = fieldData.type;
    periodQ = fieldData.period;
    limitQ = parseInt(fieldData.limit);
    offsetQ = parseInt(fieldData.offset);
    userLocale = fieldData.locale;
    channelId = obj.detail.channel.id;
    userCurrency = obj.detail.currency.code;
    displayPeople();
});


function displayPeople() {

    fetch(`https://api.streamelements.com/kappa/v2/sessions/${channelId}/top?limit=${limitQ}&offset=${offsetQ}&interval=${periodQ}&type=${typeQ}`, {
        headers: {
            'Authorization': 'apikey ' + apiKey
        }
    }).then(response => response.json()).then(obj => {
        $(".main-container").html('');
        obj.forEach(function (element) {
                if (typeQ === "tip") {
                    element.total = element.total.toLocaleString(userLocale, {
                        style: 'currency',
                        currency: userCurrency
                    });

                }
                $(".main-container").append(`
<div class="user-row">
<span class="username">${element.username}</span> - <span class="amount">${element.total}</span>
</div>`);
            }
        );
    })


}

