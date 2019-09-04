let userOptions = {};
let words = [];
let users = [];
let votes = 0;
let isActive = false;
window.addEventListener('onWidgetLoad', function (obj) {
    userOptions = obj['detail']['fieldData'];
    userOptions['channelName'] = obj['detail']['channel']['username'];
});

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== 'message') return;
    let data = obj.detail.event.data;
    let message = html_encode(data['text']);
    let user = data['nick'];
    let userstate = {
        'mod': parseInt(data.tags.mod),
        'sub': parseInt(data.tags.subscriber),
        'vip': (data.tags.badges.indexOf("vip") !== -1),
        'badges': {
            'broadcaster': (user === userOptions['channelName']),
        }

    };
    if (((userstate.mod && userOptions['managePermissions'] === 'mods') || userstate.badges.broadcaster) && (message.startsWith(userOptions['addWordCommand'] + " ") || message === userOptions['endCommand'] || message.startsWith(userOptions['startCommand'] + " "))) {
        if (message.startsWith(userOptions['startCommand']) && !isActive) {
            words = [];
            users = [];
            votes = 0;
            isActive = true;

            let params = message.replace(userOptions['startCommand'] + ' ', '').split("|");
            let question = params[0];

            if (!question.length) return;
            $('#question').html(question);
            $('#words').html('');
            for (let index = 1; index < params.length; index++) {
                addWord(params[index]);
            }
            $("#help").html("To vote type " + userOptions['voteCommand'] + " number/text (e.g. !vote 1, !vote answer)");
            if (userOptions['ignoreVoteCommand'] === "yes") {
                $("#help").append(" or just number/text (e.g. 1 or answer)");
            }
            $('.container').fadeTo('slow', 1);

        } else if (message.startsWith(userOptions['addWordCommand'])) {
            if (words.length >= userOptions['wordsLimit']) return;

            addWord(message.replace(userOptions['addWordCommand'] + ' ', ''));
        } else if (message === userOptions['endCommand']) {
            isActive = false;
            displayWords();
            $('.container').delay(1000 * userOptions['wordTimer']).fadeTo('slow', 0);

        }
        return;
    }
    if (!isActive) return;
    if (userOptions['onlyUniqueUsers'] === "yes" && users.indexOf(user) !== -1) return false;
    if (userOptions['participants'] === "subs" && !userstate.sub) return false;
    if (message.startsWith(userOptions['voteCommand']) || userOptions['ignoreVoteCommand'] === "yes") {

        message = message.replace(userOptions['voteCommand'] + ' ', '');
        let option = parseInt(message);
        let index = -1;
        if (option > 0) {
            index = words.findIndex(p => p.index === option);
        } else {
            index = words.findIndex(p => p.word === message);
        }
        if (index !== -1) {
            vote(index, user);
        }
    }


});

function html_encode(e) {
    return e.replace(/[\<\>\"\^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function addWord(word) {
    let index = words.findIndex(p => p.word === word);
    if (index > -1) return;
    words.push({
        word: word,
        index: words.length + 1,
        count: 0,
    });
    displayWords();
}

function vote(index, username) {

    if (typeof words[index] !== 'undefined') {
        users.push(username);
        words[index]['count']++;
        votes++;
        if (userOptions['scoresDisplay'] === 'live') {
            displayWords();
        }
        return true;
    } else {
        return false;

    }

}


function displayWords() {
    if (!isActive || userOptions['scoresDisplay'] === 'live') {
        words.sort(function (a, b) {
            return b.count - a.count;
        });
    }
    //let limit = Math.min(userOptions['wordsLimit'], Object.keys(words).length);
    //let starting = words.length - limit;
    let starting = 0;
    let row;
    $('#words').html('');

    for (let wordIndex = starting; wordIndex < words.length; wordIndex++) {

        row = words[wordIndex];

        let width = 0;
        let amount = '';
        if (votes > 0 && (!isActive || userOptions['scoresDisplay'] === 'live')) {
            width = parseInt(row['count'] / votes * 100);
            amount = row['count'];
        }

        let box = template('option_item', {
            id: row['index'],
            command: userOptions['voteCommand'],
            word: row['word'],
            width: width,
            amount: amount,
            background: 'background: linear-gradient(to right, ' + userOptions['progressColor'] + ' ' + width + '%, ' + userOptions['rowBG'] + ' 0);'
        });
        $('#words').append(box);
    }
    $('.amount').fadeTo('slow', 1);
}

function template(templateid, data) {
    return document.getElementById(templateid).innerHTML
        .replace(
            /{(\w*)}/g,
            function (m, key) {
                return data.hasOwnProperty(key) ? data[key] : '';
            }
        );
}