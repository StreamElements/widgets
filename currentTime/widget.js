let fieldData;
const displayTime = () => {
    let time = new Date();
    document.getElementById('clock').innerHTML = time.toLocaleString(fieldData.locale, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: fieldData.hour12,
        timeZone: fieldData.timezone
    });
};

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    setInterval(displayTime, 1000);
});
