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

    userCurrency = obj.detail.currency.code;
    let getChannelId = {
        method: 'GET',
        url: 'https://api.streamelements.com/kappa/v2/channels/' + channelName + '/',
    };
    makeRequest(getChannelId)
        .then(obj => {
            obj = JSON.parse(obj);
            channelId = obj._id;
            displayPeople();
        });
});


function displayPeople() {

    let newDataRequest = {
        method: 'GET',
        url: `https://api.streamelements.com/kappa/v2/sessions/${channelId}/top?limit=${limitQ}&offset=${offsetQ}&period=${periodQ}&type=${typeQ}`,
        headers: {
            'Authorization': 'apikey ' + apiKey
        }
    };
    makeRequest(newDataRequest)
        .then(obj => {
            obj = JSON.parse(obj);
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
        });

}

function makeRequest(opts) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }
        let params = opts.params;
        if (params && typeof params === 'object') {
            params = Object.keys(params).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }
        xhr.send(params);
    });
}

