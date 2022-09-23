# Custom Code in Alertboxes

## Before Starting
### Prerequisites
This article requires you to have an Overlay created with an AlerBox with "Custom CSS" enabled. To do so follow the steps in the [Before Starting](BeforeStarting.md) article.
## Custom Code Editor
The Custom Code Editor is a powerful tool that allows you to write custom code in the Overlay Editor. To get more 
information about the Custom Code Editor, please refer to the [Widget Structure](WidgetStructure.md) article.


## Inline Variables available

| Variable             | Description                                                                                                                                              | Example (context or output)                                                                                                                                                              |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `{{name}}`           | Person who is in subject of event.                                                                                                                       | `{{name}} just followed stream!`                                                                                                                                                         |
| `{{amount}}`         | Amount if event supports it - amount of bits, months (as resub, can be replaced with (`{{months}}`)), viewers (when hosted, raided).                     | `{{name}} just cheered with 1000 bits!`                                                                                                                                                  |
| `{{tier}}`           | Sub tier (sub events only)                                                                                                                               | `{{name}} subscribed for {{amount}} months at tier {{tier}}                                                                                                                              |
| `{{announcement}}`   | Message specified in "alert message" box to event. Alias: `{{messageTemplate}}`)                                                                         | `{announcement}` => `{name} is our sub for {amount}`                                                                                                                                     |
| `{{items}}`          | List of items in Merch event                                                                                                                             | `{{name}} just bought {{items}}`                                                                                                                                                         |
| `{{message}}`        | HTML user message attached to event (sub, cheer, tip). Remember to provide proper styling for `.alertbox-message-emote` class (alias: `{{userMessage}}`) | `{message}` =>`<span class="cheermote-1"><img class="alertbox-message-emote" alt="cheer1" src="https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/dark/animated/1/2.gif"/>1</span> Hi!` |
| `{{messageRaw}}`     | Plain text user message attached to event (sub, cheer, tip).                                                                                             | `{messageRaw}` => `Hi Kappa!`                                                                                                                                                            |
| `{{sender}}`         | If an action is a sub, `{sender}` is replaced with a person who gave it.                                                                                 | `{{sender}} just gifted a sub for {{name}}`                                                                                                                                              |
| `{{currency}}`       | Currency if event is a donation.                                                                                                                         | `{{name}} just tipped us {{currency}} {{amount}} !`                                                                                                                                      |
| `{{image}}`          | URL of image attached to alert.                                                                                                                          | `<img src="{{image}}"/>`                                                                                                                                                                 |
| `{{video}}`          | URL of video attached to alert.                                                                                                                          | `<video id="video" playsinline autoplay muted style="width:100%; height:100%"><source id="webm" src="{{video}}" type="video/webm"></video>`                                              |
| `{{videoVolume}}`    | Video volume (from 0 to 1). If alerts are muted in activity feed this value is set to 0.                                                                 | `{{videoVolume}}` => `0.5`                                                                                                                                                               |
| `{{audio}}`          | URL of audio attached to alert.                                                                                                                          | `<audio id="audio" playsinline autoplay ><source id="alertsound" src="{{audio}}" type="audio/ogg"></audio>`                                                                              |
| `{{audioVolume}}`    | Audio volume (from 0 to 1). If alerts are muted in activity feed this value is set to 0.                                                                 | `{{audioVolume}}` => `0.5`                                                                                                                                                               |
| `{{widgetDuration}}` | Widget duration in seconds, so you can create exit animation timed perfectly like on examples below:                                                     | `{{widgetDuration}}` => `5`                                                                                                                                                              |

### Examples

#### HTML
```html
<div class="alertbox-message">
    <div class="alertbox-message-text">
        <span class="alertbox-message-name">{{name}}</span>
        <span class="alertbox-message-announcement">{{announcement}}</span>
    </div>
    <div class="alertbox-message-message">{{message}}</div>
```
#### JS
```js
const hideAfter=parseInt("{widgetDuration}")-1000;
const playHideAnimation=()=>{
  timeline.reverse(); //or any other thing that will make your alert fancy exit
}
setTimeout(playHideAnimation,hideAfter);
```
#### CSS:
```css
#alertbox {
  animation: hide forwards 1s;
  animation-delay: calc({widgetDuration}s - 1s);
}
```
