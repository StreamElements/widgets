# Before Starting

Before Starting explains how to create a Custom Widget or Custom Code Alert Box, using StreamElements' the Overlay Editor UI.

We will start by creating an Overlay first and then the widgets, an Alert Box and a Custom Widget, which you'll be able edit.

## Creating an Overlay

Navigate to the [Overlays](https://streamelements.com/dashboard/overlays) section and click the **NEW OVERLAY** button.

  ![img/new-overlay-button.png](img/new-overlay-button.png)

Next you'll neeed to pick your resolution and click the **START** button.

> Overlay size: Usually it should match your stream's resolution, or be smaller than it  - if you'd like to do the repositioning in your broadcasting software.

## Alert Box

The Alert Box is a native widget that displays live events from the queue in a popup-like behavior.

To create an alertbox:

1. Click the **+** button in overlay editor
  ![img/new-widget-plus-button.png](img/new-widget-plus-button.png)

2. Select **AlertBox** in the **ALERTS** section
  ![img/new-widget-alert-box.png](img/new-widget-alert-box.png)

### Enabling Custom code for alert box

You can enable custom code for alert box by toggling the "Enable custom CSS" option for alert type you want to use.
For example open options for alertbox, go to "Followers" tab and enable custom code as on screenshot below

![img/alert-box-css-editor.gif](img/alert-box-css-editor.gif)


## Custom Widget
The Custom Widget is a native widget that you can use to display any content you want.
It is a good way to display your own content in overlay. It can consume local events (like tips, follows etc.) as well
as remote events read from a websocket or from a REST API.

To create a custom widget:

1. Click the **+** button in overlay editor
  ![img/new-widget-plus-button.png](img/new-widget-plus-button.png)

2. Select **Custom Widget** in the **STATIC/CUSTOM** section
  ![img/new-widget-custom-code.png](img/new-widget-custom-code.png)

