1) Determine your device IP address - by visiting your router web panel then go to list of connected devices
2) Go to http://IP:16021/api/v1/new to get token
3) Configure your widget using those details. Remember that effects names are case sensitive
4) Edit OBS shortcut - add a variable that will allow it to connect to Nanoleaf device: add parameters:
 `--allow-running-insecure-content --disable-web-security` 
 
    So it looks like that:
 `"C:\Program Files (x86)\obs-studio\bin\64bit\obs64.exe" --allow-running-insecure-content --disable-web-security`
 
    <img src="https://i.imgur.com/UZdBS9C.png">
Note: this widget will not work directly from browser, so you need to add it to OBS in order to test it 