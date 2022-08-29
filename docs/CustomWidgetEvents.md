# Custom Widget events
Widget receives few types of native events during lifetime.

## On Widget load

Event received upon widget is loaded. Contains information about fieldData (fields values), channel information (including apiKey) and session data.
```javascript
window.addEventListener('onWidgetLoad', function (obj) {
    //fancy stuff here
});
```
In this scope `obj` has every information you could need to use. For better readibility, Let’s assign it:
```javascript
window.addEventListener('onWidgetLoad', function (obj) {
    let data=obj["detail"]["session"]["data"];
    let recents=obj["detail"]["recents"];
    let currency=obj["detail"]["currency"];
    let channelName=obj["detail"]["channel"]["username"];
    let apiToken=obj["detail"]["channel"]["apiToken"];
    let fieldData=obj["detail"]["fieldData"];
});
```
### Possible keys within `data`:

#### Common
* `data["merch-goal-items"]["amount"]` - Merch items goal progress
* `data["merch-goal-orders"]["amount"]` - Merch orders goal progress
* `data["merch-goal-total"]["amount"]` - Merch total goal progress
* `data["tip-latest"]`    - An array containing latest Tip event
  * `data["tip-latest"]["name"]`    - Latest tipper username
  * `data["tip-latest"]["amount"]`  - Latest tip amount
  * `data["tip-latest"]["message"]` - Latest tip message
* `data["tip-session-top-donation"]` - Aan array of top tip since session start
  * `data["tip-session-top-donation"]["name"]` - Username
  * `data["tip-session-top-donation"]["amount"]` - Tip amount
* `data["tip-weekly-top-donation"]` - An array of top tip in past week
  * `data["tip-weekly-top-donation"]["name"]` - Username
  * `data["tip-weekly-top-donation"]["amount"]` - Tip amount
* `data["tip-monthly-top-donation"]` - An array of top tip in past month
  * `data["tip-monthly-top-donation"]["name"]` - Tip amount
  * `data["tip-monthly-top-donation"]["amount"]` - Username
* `data["tip-alltime-top-donation"]`  - An array of top tip all time
  * `data["tip-alltime-top-donation"]["name"]` - Username
  * `data["tip-alltime-top-donation"]["amount"]` - Tip amount
* `data["tip-session-top-donator"]` - An array of top tipper since session start
  * `data["tip-session-top-donator"]["name"]` - Username
  * `data["tip-session-top-donator"]["amount"]` - Sum of the tip amounts
* `data["tip-weekly-top-donator"]` - An array of top tip in past week
  * `data["tip-weekly-top-donator"]["name"]` - Username
  * `data["tip-weekly-top-donator"]["amount"]` - Sum of the tip amounts
* `data["tip-monthly-top-donator"]` - An array of top tip in past month
  * `data["tip-monthly-top-donator"]["name"]` - Tipper username
  * `data["tip-monthly-top-donator"]["amount"]` - Sum of the tip amounts
* `data["tip-alltime-top-donator"]`  - An array of top tip all time
  * `data["tip-alltime-top-donator"]["name"]` - Tipper username
  * `data["tip-alltime-top-donator"]["amount"]` - Sum of the tip amounts
* `data["tip-session"]["amount"]` - Sum of all donations since session start
* `data["tip-week"]["amount"]`  - Sum of all donations this week
* `data["tip-month"]["amount"]` - Sum of all donations this month
* `data["tip-total"]["amount"]` - Sum of all donations this all time
* `data["tip-count"]["count"]` - Number of tip events
* `data["tip-goal"]["amount"]` - Donation goal

#### Twitch
* `data["follower-latest"]["name"]` - Name of latest follower
* `data["follower-session"]["count"]` - Followers since session start
* `data["follower-week"]["count"]` - Followers this week
* `data["follower-month"]["count"]` - Followers this month
* `data["follower-goal"]["amount"]` - Followers goal
* `data["follower-total"]["count"]` - Total count of followers
* `data["subscriber-alltime-gifter"]` an array of
  * `data["subscriber-alltime-gifter"]["name"]` - Name of latest gifter
  * `data["subscriber-alltime-gifter"]["amount"]` - Number of gifted subs
* `data["subscriber-gifted-latest"]` an array of
  * `data["subscriber-gifted-latest"]["name"]` - Name of latest gifter
  * `data["subscriber-gifted-latest"]["amount"]` - Number of gifted subs
* `data["subscriber-gifted-session"]["count"]` - Number of gifted subs during session
* `data["subscriber-latest"]` - an array of
  * `data["subscriber-latest"]["name"]` - Name of latest sub
  * `data["subscriber-latest"]["amount"]` - Duration in months
  * `data["subscriber-latest"]["tier"]` - Tier of sub (1-3)
  * `data["subscriber-latest"]["message"]` - Message attached to sub action
  * `data["subscriber-latest"]["sender"]` - If it was a gift, here’s a gifter
  * `data["subscriber-latest"]["gifted"]` - If it was a gift, here’s a gifted
* `data["subscriber-new-latest"]` an array of
  * `data["subscriber-new-latest"]["name"]` - Name of latest new sub
  * `data["subscriber-new-latest"]["amount"]` - Number of months (1)
  * `data["subscriber-new-latest"]["message"]` - user message
* `data["subscriber-new-session"]["count"]` - Number of new subs during session
* `data["subscriber-resub-latest"]` an array of
  * `data["subscriber-resub-latest"]["name"]` - Name of latest resub
  * `data["subscriber-resub-latest"]["amount"]` - Number of months
  * `data["subscriber-resub-latest"]["message"]` - user message
* `data["subscriber-resub-session"]["count"]` - Number of resubs during session
* `data["subscriber-session"]["count"]` - Subscribers since session start
* `data["subscriber-week"]["count"]`    - Subscribers this week
* `data["subscriber-month"]["count"]`   - Subscribers this month
* `data["subscriber-goal"]["amount"]`   - Subscribers goal
* `data["subscriber-total"]["count"]`   - Total count of subscribers
* `data["subscriber-points"]["amount"]` - Subscriber points (used for unlocking additional channel emotes - more info on Twitch <a href="https://help.twitch.tv/s/article/subscriber-emoticon-guide#emoticontiers">Partner Emoticon Guide</a>)
* `data["host-latest"]["name"]` - Latest host
* `data["host-latest"]["amount"]`   - Number of viewers in latest host <em>(can be 0)</em>
* `data["raid-latest"]["name"]`     - Name of latest raider
* `data["raid-latest"]["amount"]`   - Number of viewers in latest raid
* `data["cheer-session"]["amount"]` - Cheers since session start
* `data["cheer-month"]["amount"]`   - Cheers this month
* `data["cheer-total"]["amount"]`   - Total amount of cheers
* `data["cheer-count"]["count"]`    - Number of cheer events
* `data["cheer-goal"]["amount"]`    - Cheer goal
* `data["cheer-latest"]`    - An array containing latest Cheer event
  * `data["cheer-latest"]["name"]`    - Latest cheerer
  * `data["cheer-latest"]["amount"]`  - Latest cheer amount
  * `data["cheer-latest"]["message"]` - Latest cheer message
* `data["cheer-session-top-donation"]` - Aan array of top cheerer since session start
  * `data["cheer-session-top-donation"]["name"]` - Username
  * `data["cheer-session-top-donation"]["amount"]` - Cheer amount
* `data["cheer-weekly-top-donation"]` - An array of top cheer in past week
  * `data["cheer-weekly-top-donation"]["name"]` - Username
  * `data["cheer-weekly-top-donation"]["amount"]` - Cheer amount
* `data["cheer-monthly-top-donation"]` - An array of top cheer in past month
  * `data["cheer-monthly-top-donation"]["name"]` - Username
  * `data["cheer-monthly-top-donation"]["amount"]` - Cheer amount
* `data["cheer-alltime-top-donation"]`  - An array of top cheer all time
  * `data["cheer-alltime-top-donation"]["name"]` - Username
  * `data["cheer-alltime-top-donation"]["amount"]` - Cheer amount
* `data["cheer-session-top-donator"]` - Aan array of top cheerer since session start
  * `data["cheer-session-top-donator"]["name"]` - Username
  * `data["cheer-session-top-donator"]["amount"]` - Sum of the cheer amounts
* `data["cheer-weekly-top-donator"]` - An array of top cheerer in past week
  * `data["cheer-weekly-top-donator"]["name"]` - Username
  * `data["cheer-weekly-top-donator"]["amount"]` - Sum of the cheer amounts
* `data["cheer-monthly-top-donator"]` - An array of top cheerer in past month
  * `data["cheer-monthly-top-donator"]["name"]` - Username
  * `data["cheer-monthly-top-donator"]["amount"]` - Sum of the cheer amounts
* `data["cheer-alltime-top-donator"]`  - An array of top cheer all time
  * `data["cheer-alltime-top-donator"]["name"]` - Username
  * `data["cheer-alltime-top-donator"]["amount"]` - Sum of the cheer amounts

#### Facebook
* `data["fan-latest"]["name"]` - Name of latest fan
* `data["fan-session"]["count"]` - Fans since session start
* `data["fan-week"]["count"]` - Fans this week
* `data["fan-month"]["count"]` - Fans this month
* `data["fan-total"]["count"]` - Total count of fans
* `data["fan-latest"]`    - An array containing latest fan event
* `data["follower-latest"]["name"]` - Name of latest follower
* `data["follower-session"]["count"]` - Followers since session start
* `data["follower-week"]["count"]` - Followers this week
* `data["follower-month"]["count"]` - Followers this month
* `data["follower-goal"]["amount"]` - Followers goal
* `data["follower-total"]["count"]` - Total count of followers
* `data["share-goal"]["amount"]` - Amount of  share goal
* `data["share-session"]["count"]` - Shares since session start
* `data["share-week"]["count"]` - Shares this week
* `data["share-month"]["count"]` - Shares this month
* `data["share-total"]["count"]` - Total count of shares
* `data["share-latest"]`    - An array containing latest share event
  * `data["share-latest"]["name"]` - Username
  * `data["share-latest"]["amount"]` - amount
* `data["share-recent"]`    - An array of latest share events with each element structure as in `share-latest`
* `data["stars-goal"]["amount"]` - Amount of  stars goal
* `data["stars-session"]["count"]` - Stars since session start
* `data["stars-week"]["count"]` - Stars this week
* `data["stars-month"]["count"]` - Stars this month
* `data["stars-total"]["count"]` - Total count of stars
* `data["stars-latest"]`    - An array containing latest stars event
  * `data["stars-latest"]["name"]` - Username
  * `data["stars-latest"]["amount"]` - amount
* `data["stars-recent"]`    - An array of latest stars events with each element structure as in `stars-latest`
* `data["supporter-goal"]["amount"]` - Amount of  supporter goal
* `data["supporter-session"]["count"]` - Supporters since session start
* `data["supporter-week"]["count"]` - Supporters this week
* `data["supporter-month"]["count"]` - Supporters this month
* `data["supporter-total"]["count"]` - Total count of supporters
* `data["supporter-latest"]`    - An array containing latest supporter event
  * `data["supporter-latest"]["name"]` - Username
  * `data["supporter-latest"]["amount"]` - Amount
* `data["supporter-recent"]`    - An array of latest supporter events with each element structure as in `supporter-latest`
* `data["videolike-goal"]["amount"]` - Amount of videolike goal
* `data["videolike-session"]["count"]` - Videolikes since session start
* `data["videolike-week"]["count"]` - Videolikes this week
* `data["videolike-month"]["count"]` - Videolikes this month
* `data["videolike-total"]["count"]` - Total count of videolikes
* `data["videolike-latest"]`    - An array containing latest videolike event
  * `data["videolike-latest"]["name"]` - Username
  * `data["videolike-latest"]["amount"]` - Amount
* `data["videolike-recent"]`    - An array of latest videolike events with each element structure as in `videolike-latest`

#### YouTube
* `data["sponsor-goal"]["amount"]` - Amount of  sponsor goal
* `data["sponsor-session"]["count"]` - Sponsors since session start
* `data["sponsor-week"]["count"]` - Sponsors this week
* `data["sponsor-month"]["count"]` - Sponsors this month
* `data["sponsor-total"]["count"]` - Total count of sponsors
* `data["sponsor-latest"]`    - An array containing latest sponsor event
  * `data["sponsor-latest"]["name"]` - Username
  * `data["sponsor-latest"]["amount"]` - amount
* `data["sponsor-recent"]`    - An array of latest sponsor events with each element structure as in `sponsor-latest`
* `data["subscriber-latest"]["name"]` - Name of latest subscriber
* `data["subscriber-session"]["count"]` - Subscribers since session start
* `data["subscriber-week"]["count"]` - Subscribers this week
* `data["subscriber-month"]["count"]` - Subscribers this month
* `data["subscriber-goal"]["amount"]` - Subscribers goal
* `data["subscriber-total"]["count"]` - Total count of subscribers
* `data["superchat-goal"]["amount"]` - Amount of  superchat goal
* `data["superchat-session"]["count"]` - Superchats since session start
* `data["superchat-week"]["count"]` - Superchats this week
* `data["superchat-month"]["count"]` - Superchats this month
* `data["superchat-total"]["count"]` - Total count of superchats
* `data["superchat-latest"]`    - An array containing latest superchat event
  * `data["superchat-latest"]["name"]` - Username
  * `data["superchat-latest"]["amount"]` - amount
* `data["superchat-recent"]`    - An array of latest superchat events with each element structure as in `superchat-latest`

There is a difference between:
* `cheer-*-donation` and `cheer-*-donator`
* `tip-*-donation` and `tip-*-donator`

`donation` stands for single event (biggest one-time donation/cheer in period)

`donator` stands for cumulative amount of all events by this user.

Example for better understanding:

| User  | Amount |
|-------|--------|
| UserA | 10     |
| UserB | 15     |
| UserA | 10     |

Then calling each scope will result:

| tip-alltime- | amount | name  |
|--------------|--------|-------|
| -donator     | 20     | UserA |
| -donation    | 15     | UserB |

Recent events:
You can access recent events of each type by calling:
```javascript
data["follower-recent"];
data["subscriber-recent"];
data["host-recent"];
data["raid-recent"];
data["cheer-recent"];
data["tip-recent"];
```
Each of them is an array (number indexes 0-24), and every subarray contains:
```javascript
let recentFollows=data["follower-recent"][0]; 
recentFollows["name"]; // Username,
recentFollows["createdAt"];// Timestamp like "2018-06-11T08:08:33.180Z",
recentFollows["$hashKey"]; // unique ID for example"object:5024",
recentFollows["type"]; // Event type "follower", "subscriber", "host", "raid", "cheer", "tip"
```
Depending on type there can be also:
* `subscriber-recent`
```javascript
["tier"]; //Subscriber tier (1000,2000,3000)
["amount"]; // amount of months
```
* `host-recent`
```javascript
["amount"]; // amount of viewers
```
* `raid-recent`
```javascript
["amount"]; // amount of months
```
* `cheer-recent`
```javascript
["amount"]; // amount of bits
```
* `tip-recent`
```javascript
["amount"]; // amount of tip
```


There is also a list in chronological order of last 25 events (so if you want to make list of all events - use this one) - variable `recents` initialized one line after variable `data`.<br>
It is an array of elements (each of them is array) with the same elements as in `data["*-recent"]`
The last element of `obj` is currency, which contains:
* `code` - currency code (for example “USD”)
* `name` - currency name (for example "U.S. Dollar)
* `symbol` - currency symbol (for example “$”)


## On event:
Live event for alerts, chat messages etc.
```javascript
window.addEventListener('onEventReceived', function (obj) {
    // fancy stuff here
});
```
In the example above you have obj forwarded to that function, which has two interesting scopes within `obj.detail`:
* `obj.detail.listener`: Will provide you information about event type. This value is a string. Possible values:
    * `follower-latest` - New Follower
    * `subscriber-latest` - New Subscriber
    * `host-latest` - New host
    * `cheer-latest` - New cheer
    * `tip-latest` - New tip
    * `raid-latest` - New raid
    * `message` - New chat message received
    * `delete-message` - Chat message removed
    * `delete-messages` - Chat messages by userId removed
    * `event:skip` - User clicked "skip alert" button in activity feed
    * `alertService:toggleSound` - User clicked "mute/unmute alerts" button in activity feed
    * `bot:counter` - Update of bot counter
    * `kvstore:update` - Update of [SE_API](#se-api) store value.
    * `widget-button` - User clicked custom field button in widget properties

* `obj.detail.event`: Will provide you information about event details. It contains few keys. For `-latest` events it is:
    * `.name` - user who triggered action
    * `.amount` - amount of action
    * `.message` - message attached to sub
    * `.gifted` - if this is a gift event for viewer
    * `.sender` - if it was a gift, a gifter (for community and single gifts)
    * `.bulkGifted` - if it is INITIAL event of community gift (`${event.sender} gifted ${event.amount} subs to community`)
    * `.isCommunityGift` - if it is one of community gifts train (`${event.sender} gifted ${event.name} a sub as part of random giveaway!`)
    * `.playedAsCommunityGift` - if the event was played as part of "cumulative sub bomb alert"



* there is also `userCurrency` for donations, you can use it (if initialized by `let userCurrency;`). For example: `usercurrency.symbol`

So expanding our sample code above you can have

```javascript
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj["detail"]["event"];
    // Assigned new const value, for easier handling. You can do it with .property or ["property"]. 
    // I personally recommend using [""] as some of keys can have "-" within, so you won't be able
    // to call them (JS will try to do math operation on it).
    // jQuery is included by default, so you can use following
    $("#usernameContainer").html(data["name"]);
    $("#actionContainer").html(listener);
    //You can use vanilla JS as well
    document.getElementById("amount").innerHTML=data["amount"]
});
```
### Message
For message events, there is an additional object that's accessible at `obj.detail.event.data`, which looks like this:
```json
{
  "time": 1552400352142,
  "tags": {
    "badges": "broadcaster/1",
    "color": "#641FEF",
    "display-name": "SenderName",
    "emotes": "25:5-9",
    "flags": "",
    "id": "885d1f33-8387-4206-a668-e9b1409a998b",
    "mod": "0",
    "room-id": "85827806",
    "subscriber": "0",
    "tmi-sent-ts": "1552400351927",
    "turbo": "0",
    "user-id": "85827806",
    "user-type": ""
  },
  "nick": "sendername",
  "userId": "123123",
  "displayName": "senderName",
  "displayColor": "#641FEF",
  "badges": [
    {
      "type": "broadcaster",
      "version": "1",
      "url": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
      "description": "Broadcaster"
    }
  ],
  "channel": "channelname",
  "text": "Test Kappa test",
  "isAction": false,
  "emotes": [
    {
      "type": "twitch",
      "name": "Kappa",
      "id": "25",
      "gif": false,
      "urls": {
        "1": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
        "2": "https://static-cdn.jtvnw.net/emoticons/v1/25/2.0",
        "4": "https://static-cdn.jtvnw.net/emoticons/v1/25/4.0"
      },
      "start": 5,
      "end": 9
    }
  ],
  "msgId": "885d1f33-8387-4206-a668-e9b1409a99Xb"
}
```
Every emote displayed on chat is within array of objects `emotes` with start/end index of `text` you can replace with image
NOTE: if you are creating chat widget, remember to store `msgId` and `userId` of each message (for example `<div class="message" data-msgId="${msgId}" data-userId="${userId}"></div>`) for message deletion events handling.

### Message deletion
When user message is removed by channel moderator there is an event emited either:
- `delete-message` - with msgId of message to be removed
- `delete-messages` - with userId of user whose messages have to be removed
  This functionality is to prevent abusive content displayed in chat widget.


### Bot counter
Contains two elements counter name (`counter`) and current value (`value`)
```javascript
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj.detail.event;

    if (listener === 'bot:counter' && data.counter === counter) {
        document.getElementById("mycounter").innerHTML=data.value;
    }
});
```

### Button click
Contains two elements - field name (`field`) and value (`value`). Example below will send simplified event to test your chat widget
```javascript
window.addEventListener('onEventReceived', function (obj) {
    const data = obj.detail.event;
        if (data.listener === 'widget-button') {
            if (data.field==='chat' && data.value==='First Message'){
                const emulated = new CustomEvent("onEventReceived", {
                        detail: {
                            "listener": "message",
                            event: {
                                data: {
                                    text: "Example message!",
                                    displayName: "StreamElements"
                                }
                            }
                        }
                    
                });
                window.dispatchEvent(emulated);
            }
        }
});
```

## On Session Update
```javascript
window.addEventListener('onSessionUpdate', function (obj) {
    const data = obj.detail.session;
    //fancy stuff here
});
```
This event is triggered every time a session data is updated (new tip/cheer/follower), basically most of the scenarios can be covered by `onEventReceived`, but `onSessionUpdate` provides a lot of more data you can use. The biggest advantage of using this is that you can check if top donator (not donation) changed.
> Note: Due to complexity of object in `onSessionUpdate` a `onEventReceived` event listener  will be the best way to use for most of scenarios (easier to implement and better performance).

Example:
```javascript
window.addEventListener('onSessionUpdate', function (obj) {
    const data = obj.detail.session;
     $("#top-donator").text(data["tip-session-top-donator"]["name"]+" - "+data["tip-session-top-donator"]["amount"]);
      $("#top-cheerer").text(data["cheer-session-top-donator"]["name"]+" - " +data["cheer-session-top-donator"]["amount"]);
});
```
`data` is the same as in `onWidgetLoad` so every property is listed in section above.
