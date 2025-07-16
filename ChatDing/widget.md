# Chat Ding
This widget plays a sound when a chat message is recieved in Twitch or Youtube chat (youtube untested).  Useful for streamers with few viewers that forget to check chat regularly.  There is no HTML or CSS.  This is audio only.  Feel free to edit the first JS variable to add more events to ding for.  The code is sound, but the functionality and integration could easily be improved upon.  I scraped this together and modified it from reddit.

Config options:
* Audio File URL (must end in .mp3).  There is a default entry from freesound.org
* Ding Volume
* Cooldown in seconds before new dings can be triggered

## IMPORTANT:
Do NOT use this in the "normal" StreamElements source way.  Your chat does not want to hear a ding on stream for every message.  When you add this to OBS as a browser source, check "Control Audio with OBS".  This will add an extra audio channel.  Configure this channel to "Monitor Only".  Of course, you also can't stream the all "Desktop Audio" channel using this method.
