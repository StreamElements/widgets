const minSteps = 5;
const subStepsTrigger = 10000;
let initialTotalSubs = 0;
let currentProgressStep = 0;
let hairsContainerInitialWidth = 0;
let rangeDiff = 0;
let rangeLowValueFieldData = 0;

const containers = {
    mainContainer: null,
    progressContainer: null,
    goalsContainer: null,
    hairsContainer: null,
    progressBarIndicatorContainer: null,
    razorIdleContainer: null,
    razorCutContainer: null
}

function animateProgress(subs) {
    initialTotalSubs += subs;
    const currentDiff = initialTotalSubs - rangeLowValueFieldData;
    const percentCompleted = currentDiff / rangeDiff;

    // containers.razorIdleContainer.style.opacity = 0;
    containers.razorCutContainer.style.opacity = 1;

    setTimeout(() => {
        // containers.razorIdleContainer.style.opacity = 1;
        containers.razorCutContainer.style.opacity = 0;
    }, 3300);

    for (let x = 0; x < (percentCompleted * 100); x++) {
        containers.hairsContainer.style.width = (hairsContainerInitialWidth - (hairsContainerInitialWidth * (x / 100))) + 'px';
        containers.progressBarIndicatorContainer.style.left = x + '%';
    }
}

function initializeAssets({
    backgroundImageSrc,
    progressBarBackgroundImageSrc,
    progressBarForegroundVideoSrc,
    progressIndicatorIdleVideoSrc,
    progressIndicatorActiveVideoSrc
}) {
    containers.mainContainer.style.backgroundImage = 'url(' + backgroundImageSrc + ')';
    containers.progressContainer.style.backgroundImage = 'url(' + progressBarBackgroundImageSrc + ')';

    const progressBarForegroundVideo = document.createElement('source');
    progressBarForegroundVideo.src = progressBarForegroundVideoSrc;
    containers.hairsContainer.querySelector('video').appendChild(progressBarForegroundVideo);

    const progressIndicatorIdleVideo = document.createElement('source');
    progressIndicatorIdleVideo.src = progressIndicatorIdleVideoSrc;
    containers.razorIdleContainer.appendChild(progressIndicatorIdleVideo);

    const progressIndicatorActiveVideo = document.createElement('source');
    progressIndicatorActiveVideo.src = progressIndicatorActiveVideoSrc;
    containers.razorCutContainer.appendChild(progressIndicatorActiveVideo);
}

function buildProgressBar({
    totalSubs = 0,
    rangeLowValue = 0,
    rangeHighValue = 0,
    ...mediaSources
}) {
    containers.mainContainer = document.querySelector('.main-container');
    containers.progressContainer = document.querySelector('.progress-container');
    containers.goalsContainer = document.querySelector('.goals');
    containers.hairsContainer = document.querySelector('.hairs-container');
    containers.progressBarIndicatorContainer = document.querySelector('.progress-bar-indicator');
    containers.razorIdleContainer = document.querySelector('.razor-idle');
    containers.razorCutContainer = document.querySelector('.razor-cut');

    initializeAssets(mediaSources);

    hairsContainerInitialWidth = containers.hairsContainer.getBoundingClientRect().width;

    rangeLowValueFieldData = rangeLowValue;
    rangeDiff = rangeHighValue - rangeLowValue;

    const rangeSteps = rangeDiff / minSteps;
    const goalSteps = rangeDiff / rangeSteps;

    for (let i = 0; i < goalSteps + 1; i++) {
        const goalMarker = document.createElement('div');
        goalMarker.classList.add('goal');

        if (i === goalSteps) {
            goalMarker.classList.add('end-goal');
        }

        goalMarker.style.left = `${i * 100 / goalSteps}%`;
        goalMarker.innerHTML = `${(rangeLowValue + i * rangeSteps) / 1000000}M`;

        containers.goalsContainer.appendChild(goalMarker);
    }

    animateProgress(totalSubs);
}

window.addEventListener('onSessionUpdate', function (obj) {
    const newSubsCount = Number(obj.detail.session['subscriber-total'].count) || 1;
    if (initialTotalSubs + newSubsCount % subStepsTrigger === 0) {
        animateProgress(newSubsCount);
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    buildProgressBar({
        ...obj.detail.fieldData,
        totalSubs: Number(obj.detail.session.data['subscriber-total'].count) || 1
    });
});

// document.querySelector('#simulate').addEventListener('click', () => {
//     animateProgress(10000);
// });