# Stream Elements Variable list
In each of paragraph you will find information, what variables you can use, to achieve expected result.
## Fields
### HTML
You can use any HTML tags possible, you can even import external JS if you feel such need. For example if you want to have `$("#selector").toggle('explode');` from jQueryUI, just add
```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js"></script>
```
And if you want use Google font in your CSS, just call them by:
```HTML
<link href="https://fonts.googleapis.com/css?family=Chelsea+Market" rel="stylesheet">
```
This also can be done within CSS Field by importing stylesheet
```css
@import url('https://fonts.googleapis.com/css?family=Chelsea+Market');
```
### CSS
You can use regular CSS syntax - including animations, transitions
### JS
You can use pure JavaScript or include external libraries/frameworks to ease your work, however everything will be running in protected sandbox, so you won’t be able to access cookies, `console.*` methods or IndexedDB storage.
### JSON
You can create custom variables, so end user doesn’t have to interact with code, those fields will be displayed under “OPEN EDITOR” in left panel.

This data can be also called by `{{variableName}}` or `{variableName}` within HTML/CSS/JS code (however for better readibility we suggest using those calls only in HTML/CSS).

At this point we support all of HTML5 input types (except of file - use library inputs such as `video-input` instead), as well as a handful of custom inputs: `colorpicker`, `audio-input`, `sound-input`, `video-input`, `googleFont`, `dropdown`, and `slider`.

There are some reserved field names (all future reserved words will start with `widget`):
* `widgetName` - Used to set the display name of the widget
* `widgetAuthor` - Set the author name of the widget (adds a "(by Author)" to the widget name)
* `widgetDuration` - maximum event queue hold time (seconds) - for Custom Widget (as alertboxes have their own timers). Explained in [resumeQueue section](#resumequeue-method-and-widgetduration-property) below
#### Example
##### JSON
```JSON
{
  "someText": {
    "type": "text",
    "label": "Some Text",
    "value": "Default text"
  },
  "someCheckbox": {
    "type": "checkbox",
    "label": "Some checkbox"
  },
  "someColorPicker": {
    "type": "colorpicker",
    "label": "Some color",
    "value": "#0000FF"
  },
  "someNumber": {
    "type": "number",
    "label": "Count",
    "value": 10,
    "min": 0,
    "max": 100,
    "step": 1
  },
  "someSlider": {
    "type": "slider",
    "label": "Counter",
    "value": 10,
    "min": 0,
    "max": 100,
    "step": 1
  },
  "someDropdown": {
    "type": "dropdown",
    "label": "Choose an option:",
    "value": "blue",
    "options": {
      "blue": "Blue thing",
      "apple": "Some apple",
      "7": "Lucky number"
    }
  },
  "someImage": {
     "type": "image-input",
     "label": "Some Image"
   },
 "someVideo": {
   "type": "video-input",
   "label": "Some Video"
 },
 "someSound": {
   "type": "sound-input",
   "label": "Some Audio"
 },
  "fontName": {
      "type": "googleFont",
      "label": "Select a font:",
      "value": "Roboto"
    },
  "someButton": {
    "type": "button",
    "label": "Click me!",
    "value": "Thanks"
  },
  "widgetName": {
    "type": "hidden",
    "value": "My Custom Widget"
  },
  "widgetDuration": {
      "type": "hidden",
      "value": 15
    }
}
```

Fields of type `image-input`, `video-input`, `sound-input` may use additional parameter `"multiple":true` which allows end user to provide multiple media files within single field. Output will result in array of urls.

If you want to group some fields into a collapsible menu in the left panel, you can add to them the same parameter `"group": "Some group name"`.

##### Input on left panel construction
Input field on left panel will look like:
```html
<input type="TYPE_FROM_JSON" name="FIELD_NAME" value="USER_VALUE_OR_DEFAULT_VALUE"/>
```
or for  dropdown (based on example above)
```html
<select name="someDropdown">
    <option value="blue" selected>Blue thing</option>
    <option value="apple">Some apple</option>
    <option value="7">Lucky number</option>
</select>
```
##### Usage example
Result of those custom fields can be used like:
###### HTML
```html
<div class="message">{{someDropdown}} is an option for today!<span id="additional">{{someText}}</span></div>
```
###### CSS
```css
.message {
    font-size:{{someSlider}}px;
    color: {{someColorPicker}};
}
```
###### JS
```javascript
let someVariable,magicNumber;
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    someVariable=fieldData["someText"];
    // OR
    magicNumber=fieldData.someNumber;    
});
```
## Alert widget
`{{name}}` - Person who is in subject of event. For example `{{name}} just followed stream!`<br>
`{{amount}}` -Amount if event supports it - amount of bits, months (as resub, can be replaced with (`{{months}}`)), viewers (when hosted, raided). For example `{{name}} just cheered with 1000 bits!`<br>
`{{tier}}` - Sub tier (sub events only)<br>
`{{announcement}}` - Message attached to event (sub, cheer, tip). For example `{name} is our sub for {amount}` (alias: `{{messageTemplate}}`)<br>
`{{items}}` - List of items in Merch event <br>
`{{message}}` - HTML user message attached to event (sub, cheer, tip). Example value `  <span class="cheermote-1"><img class="alertbox-message-emote" alt="cheer1" src="https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/dark/animated/1/2.gif"/>1</span> Hi!`. Remember to provide proper styling for `.alertbox-message-emote` class (alias: `{{userMessage}}`)<br>
`{{messageRaw}}` - Plain text user message attached to event (sub, cheer, tip). Example value `Hi Kappa!`.<br>
`{{sender}}` - If an action is a sub, `{sender}` is replaced with a person who gave it. For example `{{sender}} just gifted a sub for {{name}}`<br>
`{{currency}}` - Currency if event is a donation. For example {{name}} just tipped us {{currency}} {{amount}} !<br>
`{{image}}` - URL of image attached to alert. For example `<img src="{{image}}"/>`<br>
`{{video}}` - URL of video attached to alert . For example `<video id="video" playsinline autoplay muted style="width:100%; height:100%"><source id="webm" src="{{video}}" type="video/webm"></video>`<br>
`{{videoVolume}}` - Video volume (from 0 to 1). If alerts are muted in activity feed this value is set to 0<br>
`{{audio}}` - URL of audio attached to alert . For example `<audio id="audio" playsinline autoplay ><source id="alertsound" src="{{audio}}" type="audio/ogg"></audio>`<br>
`{{audioVolume}}` - Audio volume (from 0 to 1). If alerts are muted in activity feed this value is set to 0<br>
`{{widgetDuration}}` - Widget duration in seconds, so you can create exit animation timed perfectly like on examples below:
```js
const hideAfter=parseInt("{widgetDuration}")-1000;
const playHideAnimation=()=>{
  timeline.reverse(); //or any other thing that will make your alert fancy exit
}
setTimeout(playHideAnimation,hideAfter);
```
Or CSS:
```css
#alertbox {
  animation: hide forwards 1s;
  animation-delay: calc({widgetDuration}s - 1s);
}
```

## Custom Widget
This is the most powerful tool in SE Overlay editor. You can do a lot of things within this widget using HTML/CSS/JavaScript and accessing variables<br>
Note:
> You cannot access `document.cookie` nor `IndexedDB` via it (security reasons), so you need to keep your data elsewhere (accessible via HTTP api) or [SE_API](#se-api) store.

### On event:
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
#### Message
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

#### Message deletion
When user message is removed by channel moderator there is an event emited either:
- `delete-message` - with msgId of message to be removed
- `delete-messages` - with userId of user whose messages have to be removed
This functionality is to prevent abusive content displayed in chat widget.  


#### Bot counter
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

#### Button click
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



### On Widget load
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
#### Possible keys within `data`:

##### Common
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

##### Twitch
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

##### Facebook
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

##### YouTube
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

User | Amount
-----|-------
UserA|10
UserB|15
UserA|10

Then calling each scope will result:

tip-alltime- | amount | name
-------------|--------|-----
-donator|20|UserA
-donation|15|UserB

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

### On Session Update
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

### SE API
A global object is provided to access basic API functionality. The overlay's API token is also provided (via the `onWidgetLoad` event below) for more direct REST API calls to be used as authorization header.

```javascript
SE_API.store.set('keyName', obj); // stores an object into our database under this keyName (multiple widgets using the same keyName will share the same data. keyName can be an alphanumeric string only).
SE_API.store.get('keyName').then(obj => {
    // obj is the object stored in the db, must be a simple object
});
SE_API.counters.get('counterName').then(counter => {
    // counter is of the format { counter, value }
});

SE_API.sanitize({ message: "Hello SomeVulgarWorld"}).then(sanityResult => {
/*
    sanityResult={
        "result":{
            "message":"Hello Kreygasm" //Message after validation
        },
        "skip":false // Should it be skipped according to rules 
    }
*/  
});

SE_API.cheerFilter(message).then(cheerResult => {
	// cheerResult = "message but without any cheers in it";
});

SE_API.setField('key', 'value'); // Sets the fieldData[key] = value. This does not save, so should be used with Editor Mode so the user can save.
SE_API.getOverlayStatus(); // { isEditorMode: true/false, muted: true/false }
```
`SE_API.store.set` method emits an event received by every custom widget. Example payload:
```json
{
	"detail": {
		"listener": "kvstore:update",
		"event": {
			"data": {
				"key": "customWidget.keyName",
				"value": {
					"array": [
						33,
						"foobar"
					],
					"date": "2021-03-15T08:46:10.919Z",
					"test": 15
				}
			}
		}
	}
}
```
#### resumeQueue method and widgetDuration property
widgetDuration property defines maximum event queue hold time (execution time of widget) by widget in seconds (default 0). For example you want to show animations by this widget and don't want them overlap, so instead building your own queue you can use this. This property is defined in JSON (as mentioned above)
Premature queue resume can be called by `SE_API.resumeQueue();`

The best way to explain this is an example code. 

Scenario:
> We have animation for community sub gifts (only) we want to use. Animation duration is dynamic between 7 and 15 seconds and we don't want it to overlap on alerts.

  
Code:
##### Fields:
```json
{
    "widgetDuration":{
      "type": "hidden",
      "value": 15
    }
}
```
##### JS:
```js
let skippable=["bot:counter","event","event:test","event:skip","alertService:toggleSound","message","delete-message","delete-messages","kvstore:update"]; //Array of events coming to widget that are not queued so they can come even queue is on hold
let playAnimation=(event)=>{
    $("container").html(`<div id="sender">${event.sender}</div><div class="amount">${event.amount} subs!</div>`)
    return Math.floor(Math.random()*8)+7;
};
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
  	console.log(obj.detail);
    const data = obj.detail.event;
	console.log(`RECEIVED ${listener}`);
  	if (skippable.indexOf(listener)!==-1) return;
  	if (listener !== 'subscriber-latest') {
    	console.log("Resuming as event is not sub");
          SE_API.resumeQueue(); 
          return;
        }
  	if (data.bulkGifted !== true && !data.gifted) {
    	  console.log("Resuming as event is not sub gift");
          SE_API.resumeQueue();
          return;
    }    
     if (data.name === data.sender) {
         console.log("Getting animation duration for premature resume");
         let time=playAnimation(data);
         setTimeout(SE_API.resumeQueue,time*1000); 
     }
});
```
   
## Overlay Editor shortcuts

Key | Action
-----|-------
Del|Delete selected widget
Shift + d|Duplicate selected widget
Arrow|Move widget 1px
Shift + arrow|Move widget 10px
Esc|Unselect widgets
Ctrl/Command + z|Undo last action
Ctrl/Command + y|Redo last undo action
Alt + x|Reset zoom
Alt + f|Fit to screen
Shift + g|Group selected widgets
Shift + u|Ungroup selected widget group
