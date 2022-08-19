# Custom Code in Alertboxes

Once you create Alertbox you can enable custom code in it. Use the left panel to "Enable CSS" and open Editor.


## Inline Variables available
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
