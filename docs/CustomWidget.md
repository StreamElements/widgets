# Custom Widget 
This is the most powerful tool in SE Overlay editor. You can do a lot of things within this widget using HTML/CSS/JavaScript and accessing variables<br>
Note:
> You cannot access `document.cookie` nor `IndexedDB` via it (security reasons), so you need to keep your data elsewhere (accessible via HTTP api) or [SE_API](#se-api) store.

## Before Starting
### Prerequisites
This article requires you to have an Overlay created with a Custom Widget added there. To do so follow the steps in the [Before Starting](BeforeStarting.md) article.
### Custom Code Editor
The Custom Code Editor is a powerful tool that allows you to write custom code in the Overlay Editor. To get more
information about the Custom Code Editor, please refer to the [Widget Structure](WidgetStructure.md) article.


## SE API
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
`SE_API.store.set` method emits an event received by every Custom Widget. Example payload:
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
### resumeQueue method and widgetDuration property
widgetDuration property defines maximum event queue hold time (execution time of widget) by widget in seconds (default 0). For example you want to show animations by this widget and don't want them overlap, so instead building your own queue you can use this. This property is defined in JSON (as mentioned above)
Premature queue resume can be called by `SE_API.resumeQueue();`

The best way to explain this is an example code. 

Scenario:
> We have animation for community sub gifts (only) we want to use. Animation duration is dynamic between 7 and 15 seconds and we don't want it to overlap on alerts.

  
Code:
#### Fields:
```json
{
    "widgetDuration":{
      "type": "hidden",
      "value": 15
    }
}
```
#### JS:
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
