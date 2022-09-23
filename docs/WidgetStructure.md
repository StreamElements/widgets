# Code Editor 

This section describes the StreamElements Custom Code Editor and Widget's Structure. 
Custom code editor is a simple text editor that allows you to write code, styling, field definitions.

## HTML
You can use any HTML tags possible, you can even import external JS if you feel such need. For example if you want to have `$("#selector").toggle('explode');` from jQueryUI, just add
```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js"></script>
```
And if you want to use Google font in your CSS, just call them by:
```HTML
<link href="https://fonts.googleapis.com/css?family=Chelsea+Market" rel="stylesheet">
```
This also can be done within CSS Field by importing stylesheet
```css
@import url('https://fonts.googleapis.com/css?family=Chelsea+Market');
```
## CSS
You can use regular CSS syntax - including animations, transitions
## JS
You can use pure JavaScript or include external libraries/frameworks to ease your work, however everything will be running in protected sandbox, so you won’t be able to access cookies, `console.*` methods or IndexedDB storage.
## FIELDS
You can create custom variables, so end user doesn't have to interact with code, those fields will be displayed under “OPEN EDITOR” in left panel.

This data can be also called by `{{variableName}}` or `{variableName}` within HTML/CSS/JS code (however for better readibility we suggest using those calls only in HTML/CSS).

At this point we support all of HTML5 input types (except of file - use library inputs such as `video-input` instead), as well as a handful of custom inputs: `colorpicker`, `audio-input`, `sound-input`, `video-input`, `googleFont`, `dropdown`, and `slider`.

There are some reserved field names (all future reserved words will start with `widget`):
* `widgetName` - Used to set the display name of the widget
* `widgetAuthor` - Set the author name of the widget (adds a "(by Author)" to the widget name)
* `widgetDuration` - maximum event queue hold time (seconds) - for Custom Widget (as alertboxes have their own timers). Explained in [resumeQueue section](#resumequeue-method-and-widgetduration-property) below
### Example
#### JSON
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

#### Input on left panel construction
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
#### Usage example
Result of those custom fields can be used like:
##### HTML
```html
<div class="message">{{someDropdown}} is an option for today!<span id="additional">{{someText}}</span></div>
```
##### CSS
```css
.message {
    font-size:{{someSlider}}px;
    color: {{someColorPicker}};
}
```
##### JS
```javascript
let someVariable,magicNumber;
window.addEventListener('onWidgetLoad', function (obj) {
    const {fieldData} = obj.detail;
    someVariable = fieldData["someText"];
    // OR
    magicNumber = fieldData.someNumber;
    // OR use internal templating variables
    magicNumber = parseFloat("{{someNumber}}");
});
```
