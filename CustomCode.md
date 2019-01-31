#<a id="Stream_Elements_Variable_list_0"></a>Stream Elements Variable list
In each of paragraph you will find information, what variables you can use, to achieve expected result.
##<a id="Fields_4"></a>Fields
###<a id="HTML_6"></a>HTML
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
###CSS
You can use regular CSS syntax - including animations, transitions
###JS
You can use pure JavaScript or include external libraries/frameworks to ease your work, however everything will be running in protected sandbox, so you won’t be able to access cookies, `console.*` methods or IndexedDB storage.
###JSON
You can create custom variables, so enduser doesn’t have to interact with code, those fields will be displayed under “OPEN EDITOR” in left panel.<br>
This data can be also called by `{{variableName}}` or `{variableName}` within HTML/CSS/JS code (however for better readibility we suggest using those calls only in HTML/CSS)<br>
At this point we support all of HTML5 input types (except of file and date/datetime-local)
####Example
#####JSON
```JSON
{
  "someText": {
    "type": "text",
    "label": "Some Text",
    "value": "Default text"
  },
   "someColorPicker": {
      "type": "colorpicker",
      "label": "Some color",
      "value": "#0000FF"
    },
    "someNumber": {
        "type": "number",
        "label": "Count",
        "value": 10
      },
   "someSlider": {
      "type": "slider",
      "label": "Counter",
      "value": 10,
      "min": 0,
      "max": 100,
      "steps": 1
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
     }
}
```
#####Input on left panel construction
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
#####Usage example
Result of those custom fields can be used like:
######HTML
```html
<div class="message">{{someDropDown}} is an option for today!<span id="additional">{{someText}}</span></div>
```
######CSS
```css
.message {
    font-size:{{someSlider}}px;
    color: {{someColorPicker}};
}
```
######JS
```javascript
let someVariable,magicNumber;
window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    someVariable=fieldData["someText"];
    // OR
    magicNumber=fieldData.someNumber;    
});
```
##Alert widget
`{{name}}` - will be replaced with a person who is in subject of event. For example `{{name}} just followed stream!`<br>
`{{amount}}` - will be replaced with amount if event supports it - amount of bits, months (as resub), viewers (when hosted, raided). For example `{{name}} just cheered with 1000 bits!`<br>
`{{message}}` - message attached to event (sub, cheer, tip). For example `{name} is our sub for {amount} months, and he wanted to say {{message}}`<br>
`{{sender}}` - if an action is a sub, `{sender}` is replaced with a person who gave it. For example `{{sender}} just gifted a sub for {{name}}`<br>
`{{currency}}` - replaced with currency if event is a donation. For example {{name}} just tipped us {{currency}} {{amount}} !<br>
`{{image}}` - replaced with image attached to alert URL. For example `&lt;img src="{{image}}"/&gt;`<br>
`{{video}}` - will be replaced with video attached to alert URL. For example `&lt;video id="video" playsinline autoplay muted style="width:100%; height:100%"&gt;&lt;source id="webm" src="{{video}}" type="video/webm"&gt;&lt;/video&gt;`
##Custom Widget
This is the most powerful tool in SE Overlay editor. You can do a lot of things within this widget using HTML/CSS/JavaScript and accessing variables<br>
Note:
> You cannot access `document.cookie` nor `IndexedDB` via it (security reasons), so you need to keep your data elsewhere (accessible via HTTP api), so you could use it via AJAX calls. We tried keyvalue.xyz and it works.

###On event:
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

* `obj.detail.event`: Will provide you information about event details. It contains few keys:
    * `.name` - user who triggered action
    * `.amount` - amount of action
    * `.message` - if there was a message attached to it
    * `.sender` - if it was a gift, a gifter


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
###On Widget load
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
});
```
Possible keys within `data`:
* `data["follower-latest"]["name"]` - Name of latest follower
* `data["follower-session"]["count"]` - Followers since session start
* `data["follower-week"]["count"]` - Followers this week
* `data["follower-month"]["count"]` - Followers this month
* `data["follower-goal"]["amount"]` - Followers goal
* `data["follower-total"]["count"]` - Total count of followers
* `data["subscriber-latest"]` - an array of
    * `data["subscriber-latest"]["name"]` - Name of latest sub
    * `data["subscriber-latest"]["amount"]` - Duration in months
    * `data["subscriber-latest"]["tier"]` - Tier of sub (1-3)
    * `data["subscriber-latest"]["message"]` - Message attached to sub action
    * `data["subscriber-latest"]["sender"]` - If it was a gift, here’s a gifter
    * `data["subscriber-latest"]["gifted"]` - If it was a gift, here’s a gifted
* `data["subscriber-session"]["count"]` - Subscribers since session start
* `data["subscriber-week"]["count"]`    - Subscribers this week
* `data["subscriber-month"]["count"]`   - Subscribers this month
* `data["subscriber-goal"]["amount"]`   - Subscribers goal
* `data["subscriber-total"]["count"]`   - Total count of subscribers
* `data["subscriber-points"]["amount"]` - Subscriber points more info on Twitch <a href="https://help.twitch.tv/customer/portal/articles/2348985">Subscriber Points</a>
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
    * `data["cheer-monthly-top-donation"]["name"]` - Cheer amount
    * `data["cheer-monthly-top-donation"]["amount"]` - Username
* `data["cheer-alltime-top-donation"]`  - - An array of top cheer all time
    * `data["cheer-alltime-top-donation"]["name"]` - Username
    * `data["cheer-alltime-top-donation"]["amount"]` - Cheer amount
* `data["cheer-session-top-donator"]` - Aan array of top cheerer since session start
    * `data["cheer-session-top-donator"]["name"]` - Username
    * `data["cheer-session-top-donator"]["amount"]` - Sum of the cheer amounts
* `data["cheer-weekly-top-donator"]` - An array of top cheerer in past week
    * `data["cheer-weekly-top-donator"]["name"]` - Username
    * `data["cheer-weekly-top-donator"]["amount"]` - Sum of the cheer amounts
* `data["cheer-monthly-top-donator"]` - An array of top cheerer in past month
    * `data["cheer-monthly-top-donator"]["name"]` - Sum of the cheer amounts
    * `data["cheer-monthly-top-donator"]["amount"]` - Username
* `data["cheer-alltime-top-donator"]`  - - An array of top cheer all time
    * `data["cheer-alltime-top-donator"]["name"]` - Username
    * `data["cheer-alltime-top-donator"]["amount"]` - Sum of the cheer amounts
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
* `data["tip-alltime-top-donation"]`  - - An array of top tip all time
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
* `data["tip-alltime-top-donator"]`  - - An array of top tip all time
    * `data["tip-alltime-top-donator"]["name"]` - Tipper username
    * `data["tip-alltime-top-donator"]["amount"]` - Sum of the tip amounts
* `data["tip-session"]["amount"]` - Sum of all donations since session start
* `data["tip-week"]["amount"]`  - Sum of all donations this week
* `data["tip-month"]["amount"]` - Sum of all donations this month
* `data["tip-total"]["amount"]` - Sum of all donations this all time
* `data["tip-count"]["count"]` - Number of tip events
* `data["tip-goal"]["amount"]` - Donation goal

There is a difference between:
* `cheer-*-donation` and `cheer-*-donator`
* `tip-*-donation` and `tip-*-donator`

`donation` stands for single event (biggest one-time donation/cheer in period)

`donator` stands for cumulative amount of all events by this user.

Example for better understanding:
User|Amount
----|------
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

###On Session Update
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
