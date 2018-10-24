let name = "{{name}}";

$.get("https://decapi.me/twitch/avatar/" + name, function(data) {
    $("#picture").attr('src', data);

});
