const container = document.getElementsByClassName("main-container")[0];
const alert = document.getElementsByClassName("alert")[0];
const goal = document.getElementsByClassName("goal")[0];
const progress = document.getElementsByClassName("goal-progress")[0];
const alertUser = document.getElementsByClassName("alert-user")[0];
const alertDonation = document.getElementsByClassName("alert-donation")[0];
const alertMessage = document.getElementsByClassName("alert-message")[0];

let donations = [],
    donationGoal = 0,
    donationSum = 0,
    donationPercent = 0,
    lastDonationDateTime = '',
    audio = new Audio('{alertSound}'),
    goalComplete = new Audio('{goalCompleteSound}'),
    goalMet = false,
    size = "{size}",
    sideDisplay = "{sideDisplay}";

let playAlert = () => {
    if ({enableAlerts}) {
        alertUser.innerHTML = donations[0].displayName || "Anonymous";
        alertDonation.innerHTML = "$" + donations[0].amount;

        if (donations[0].message != undefined) {
            alertMessage.innerHTML = donations[0].message.substring(0, 150) || "";
        } else {
            alertMessage.innerHTML = "";
        }

        alert.classList.add("alert-show");
        void alert.offsetWidth;
        alert.classList.remove("alert-hide");

        setTimeout(() => {
            alert.classList.add("alert-hide");
            void alert.offsetWidth;
            alert.classList.remove("alert-show");
        } , 8000);

        audio.play();
    }
};

let updateProgress = (percent) => {
    if (percent > 100) {
        progress.style.height = "100%";
    } else {
        progress.style.height = percent + "%";
    }
};

let sleep = () => {
    return new Promise(resolve => setTimeout(resolve, 8000));
};

let arrayColumn = (arr, n) => {
    return arr.map(x => x[n]);
};

async function getLatestDonations() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}/donations?where=createdDateUTC>%3D%27" + donations[0].createdDateUTC + "%27");
    const text = await response.text();
    return JSON.parse(text);
}

function checkForDonation() {
    if ("{participantId}" !== "") {
        getLatestDonations().then(async (donos) => {
            for (let i = 0; i < donos.length; i++) {
                if (!arrayColumn(donations, "donationID").includes(donos[i].donationID) && donos[i].createdDateUTC >= donations[0].createdDateUTC) {
                    donations.unshift(donos[i]);
                    donationSum = donationSum + donations[0].amount;

                    if (donationSum >= donationGoal && !goalMet) {
                        goalComplete.play();
                        goalMet = true;
                    }

                    let percent = (donationSum / donationGoal) * 100;
                    updateProgress(percent);
                    playAlert();
                    await sleep();
                }
            }

            setTimeout(function () { checkForDonation(); }, 15000);
        });
    }
}

async function getELDetails() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}");
    const text = await response.text();
    return JSON.parse(text);
}

async function getDonations() {
    const response = await fetch("https://extralife.donordrive.com/api/{ExtraLifeType}/{participantId}/donations?limit=10");
    const text = await response.text();
    donations = JSON.parse(text);
}

window.addEventListener("onWidgetLoad", async function (obj) {
    if (size == "{size}") {
        size = "medium";
    }

    if (sideDisplay == "{sideDisplay}") {
        sideDisplay = "left";
    }

    container.classList.toggle("size-" + size);
    goal.classList.toggle("goal-" + sideDisplay);
    alert.classList.toggle("alert-" + sideDisplay);

    if ("{participantId}" !== "") {
        getELDetails().then(obj => {
            donationGoal = obj.fundraisingGoal;
            donationSum = obj.sumDonations;

            if (donationSum >= donationGoal) {
                goalMet = true;
            }

            donationPercent = (donationSum / donationGoal) * 100;
            updateProgress(donationPercent);
            getDonations();
            setTimeout(function () {
                checkForDonation();
            }, 15000);
        });
    }
});

window.addEventListener("onEventReceived", function (obj) {
    const event = obj.detail.event;

    if (event.listener === 'widget-button' && event.field === 'testAlert') {
        playAlert();
    }
});
