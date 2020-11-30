let whenNotFound = '{whenNotFound}'; //Obtain the value from the logo field
let fieldData = {};
let queue = [];
let isPlaying = false;
let emoticons = [];
let customCommand = '{customCommand}';
let notifDuration = parseFloat("{notificationTime}") * 1000;
let localVar = [];
//This is the Matrix where you need to include your selected streamers to have their unique video/animation and text
let vipUsersData = {};
let processed = [];

let service = "twitch";
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
    localVar = [
        {
            soundFile: fieldData.defaultSound,
            volume: fieldData.volumeSlider,
            defaultVid: fieldData.defaultVideo,
            defaultVidSize: fieldData.defaultVideoSize,
            defaultVidHeight: fieldData.videoHeight,
            defaultVidVolume: fieldData.defaultVideoVolume,
            defaultImg: fieldData.defaultImage,
            defaultImgSize: fieldData.defaultImageSize,
            defaultImgHeight: fieldData.imageHeight
        }
    ]
    for (let i = 0; i <= 40; i++) {
        if (typeof fieldData[`vip${i}`] === "undefined") continue;
        if (fieldData[`vip${i}`].length === 0) continue;
        vipUsersData[fieldData[`vip${i}`].toLowerCase()] = {
            "topText": fieldData[`vip${i}TopText`],
            "lowerText": fieldData[`vip${i}LowerText`],
            "video": fieldData[`vip${i}Video`],
            "videoVolume": fieldData[`vip${i}VideoVolume`],
            "videoSize": fieldData[`vip${i}VideoSize`],
            "videoVertPos": fieldData[`vip${i}VideoHeight`],
            "image": fieldData[`vip${i}Image`],
            "imageSize": fieldData[`vip${i}ImageSize`],
            "imageVertPos": fieldData[`vip${i}ImageHeight`],
            "soundOnOff": fieldData[`vip${i}OnOffSound`],
            "sound": fieldData[`vip${i}Sound`],
            "soundVolume": fieldData[`vip${i}SoundVolume`]
        };
    }
    console.log(vipUsersData);
});

const parseQueue = () => {
    if (isPlaying) return;
    if (!queue.length) return;
    isPlaying = true;
    console.log("Playing new user");
    const data = queue.shift();
    awesomeshoutout(data.name, data.service, data.avatar);

}

window.addEventListener('onEventReceived', function (obj) {

    if (obj.detail.listener !== "message") return;
    const data = obj.detail.event.data;
    const service = data["service"] ?? "twitch";
    if (fieldData.method === "firstMessage") {
        if (processed.indexOf(data["displayName"]) !== -1) return;
        if (typeof vipUsersData[data["displayName"].toLowerCase()] === "undefined") return;
        if (service === "twitch") {
            queue.push({name: data["displayName"], service: "twitch", avatar: ""});
            parseQueue();
        } else {
            queue.push({name: data["displayName"], service: service, avatar: data.avatar});
            parseQueue();
        }
        processed.push(data["displayName"]);
    } else {
        //console.log("Obj:"+JSON.stringify(obj.detail));


        if (data["displayName"] === "StreamElements") return;
        const message = data["text"];
        const command = message.split(" ")[0];
        const soname = message.split(" ")[1].replace(/[@]/, '');

        if (service === "twitch") { /* THIS IS FOR TWITCH  */

            if (data["displayName"] === "StreamElements") return;
            let badge1, badge2, badge3 = '';
            if (data["badges"][0]["type"])
                badge1 = data["badges"][0]["type"];
            if (command.toLowerCase() === customCommand && (badge1 === 'moderator' || badge1 === 'broadcaster')) {
                //Remove '@' from the name, in the case it was sent in that way from chat
                queue.push({name: soname, service: "twitch", avatar: ""});
                parseQueue();

            }
        } else if (service === "facebook") { /* THIS IS FOR FACEBOOK  */
            let ownername = "";
            //console.log('data.channel='+data.channel);
            /*fetch('https://api.streamelements.com/kappa/v2/channels/'+data.channel+'/').then(response => response.json()).then((profile) => {
              ownername = profile.username;
          });*/


            //console.log('data["displayName"]='+data["displayName"]+', ownername='+ownername);
            //if (command.toLowerCase() === customCommand && ownername === data["displayName"]) {
            if (command.toLowerCase() === customCommand) {
                queue.push({name: soname, service: service, avatar: data.avatar});
                parseQueue();

            }
            //console.log("Entro a facebook");
        }

    }
});

function awesomeshoutout(soname, service = "twitch", avatarToken = "") {
    const name = soname.toLowerCase();
    let result = false;
    let foundInMatrix = false;
    let localVariables = localVar[0];
    let userMatrix = vipUsersData[name];
    let mainText = '{mainText}';
    let subText = '{subText}';
    let playSound = '{playSound}';
    let playTime = notifDuration;
    // Checks if the name is in the matrix
    if (!(name in vipUsersData)) {
        //The name is not in the matrix
        /*console.log('Name not found. whenNotFound='+whenNotFound);*/

        result = doWhenNotFound(localVariables, soname, service, avatarToken); //Verify if we will show avatar, default image or default video or nothing
    } else { //The name is on the matrix
        foundInMatrix = true;

        //Check if its a video
        if (isVideo(userMatrix["video"])) {
            playTime = Math.max(playTime, 1000 * playVideo(userMatrix["video"], userMatrix["videoVolume"], userMatrix["videoSize"], userMatrix["videoVertPos"]));
            result = true;
        } //If not,Validate if its a valid image
        else if (isImage(userMatrix["image"])) {

            setImage(userMatrix["image"], userMatrix["imageSize"], userMatrix["imageVertPos"]);
            result = true;
        }//If not a image nor a video, then fallback to what the whenNotFound configuration says
        else {
            result = doWhenNotFound(localVariables, soname);
        }

        if ("topText" in userMatrix) {
            mainText = userMatrix["topText"];
        }

        if ("lowerText" in userMatrix) {
            subText = userMatrix["lowerText"];
        }
    }
    console.log('before checking result=' + result + ', mainText=' + mainText + ',subText=' + subText + ',Name=' + soname);
    if (result) {
        /*console.log('Enter to result, mainText='+mainText1+',subText='+subText+',Name='+soname);*/
        setTexts(mainText, subText, soname); // Sets the text

        //console.log('playSound before: '+playSound);

        if (foundInMatrix) {
            playSound = userMatrix["soundOnOff"];
        }
        //console.log('playSound after: '+playSound);

        switch (playSound) {
            case true:
                console.log('playSound, enter true');

                if (userMatrix["sound"]) {
                    //console.log('userMatrix["sound"]='+userMatrix["sound"]+', and userMatrix["soundVolume"]='+userMatrix["soundVolume"]);

                    playTime = Math.max(playTime, 1000 * playAudio(userMatrix["sound"], userMatrix["soundVolume"])); //Play the sound loaded in the Default Sound

                } else {
                    console.log('localVariables.soundFile=' + localVariables.soundFile + 'localVariables.volume=' + localVariables.volume);
                    playTime = Math.max(playTime, 1000 * playAudio(localVariables.soundFile, localVariables.volume)); //Play the sound loaded in the Default Sound
                }

                break;
            case "notFound":
                console.log('Enter when not found, localVariables.soundFile=' + localVariables.soundFile + 'localVariables.volume=' + localVariables.volume);
                playTime = Math.max(playTime, 1000 * playAudio(localVariables.soundFile, localVariables.volume)); //Play the sound loaded in the Default Sound
                break;
            default:
                console.log('Do not play');
                break;
        }
    }
    setTimeout(() => {
        isPlaying = false;
        parseQueue();
    }, playTime)
}

function doWhenNotFound(localVariables, name, service = "twitch", avatarToken = "") {
    let data = null;
    let xhr = new XMLHttpRequest();
    let result = false;

    avatarToken = avatarToken.replace("small", "large");
    //Verify if we will show avatar, default image or default video or nothing
    switch (whenNotFound) {
        case "show":

            /*if (service==='facebook'){

              //console.log('Entro true');
              xhr.addEventListener("readystatechange", function () {
              //console.log('this.readyState:'+this.readyState+ ',this.status:'+this.status);

                  if ((this.readyState == 2 || this.readyState == 3 || this.readyState == 4) && (this.status == 400 || this.status == 404)) {
                      return;
                  }
                  if (this.readyState == 4 && this.status == 200) {
                      //console.log('Got answer');
                      //if (!this.responseText.match(/No user with the name.*/
            /*)){
              setImage(this.responseText, localVariables.defaultImgSize, localVariables.defaultImgHeight ); //Sets the user avatar as image
          }
      }
  });

  //console.log('before sending data');
  xhr.open("GET", avatarToken);
  xhr.setRequestHeader("accept", "application/json");
  xhr.send(data);
}
else if (service==='twitch'){*/
            /*console.log('Entro true');
            xhr.addEventListener("readystatechange", function () {
            //console.log('this.readyState:'+this.readyState+ ',this.status:'+this.status);

                if ((this.readyState == 2 || this.readyState == 3 || this.readyState == 4) && (this.status == 400 || this.status == 404)) {
                    return;
                }
                if (this.readyState == 4 && this.status == 200) {
                    console.log('Got answer, !this.responseText.includes("User not found") ='+ !this.responseText.includes("User not found"));

                    if (!this.responseText.includes("No user with the name") && !this.responseText.includes("User not found")){
                      console.log("Entro a meter la imagen");
                        setImage(this.responseText, localVariables.defaultImgSize, localVariables.defaultImgHeight ); //Sets the user avatar as image
                    }else{
                      console.log("Entro a regresar false");
                        return false;
                      }
                }else{
                    return false;
                }
            });

            //console.log('before sending data');
            xhr.open("GET", "https://decapi.me/twitch/avatar/"+name);
            xhr.setRequestHeader("accept", "application/json");
            xhr.send(data);
         }*/
            xhr.open("GET", "https://decapi.me/twitch/avatar/" + name, false);
            xhr.setRequestHeader("accept", "application/json");
            xhr.send(data);

            console.log('Got answer, !this.responseText.includes("User not found") =' + !xhr.responseText.includes("User not found"));
            if (xhr.status == 400 || xhr.status == 404) {
                return;
            }
            if (xhr.status == 200) {
                console.log('Got answer, !this.responseText.includes("User not found") =' + !xhr.responseText.includes("User not found"));

                if (!xhr.responseText.includes("No user with the name") && !xhr.responseText.includes("User not found")) {
                    console.log("Entro a meter la imagen");
                    setImage(xhr.responseText, localVariables.defaultImgSize, localVariables.defaultImgHeight); //Sets the user avatar as image
                    return true;
                } else {
                    console.log("Entro a regresar false");
                    return false;
                }
            } else {
                return false;
            }
            break;
        case "video":
            //console.log('Entered video');
            if (localVariables.defaultVid) {
                playVideo(localVariables.defaultVid, localVariables.defaultVidVolume, localVariables.defaultVidSize, localVariables.defaultVidHeight);
                return true;
            }
            break;
        case "image":
            //console.log('Entered image');
            if (isImage(localVariables.defaultImg)) {
                setImage(localVariables.defaultImg, localVariables.defaultImgSize, localVariables.defaultImgHeight);
                return true;
            }
            break;
        default:
            //console.log('Entered default, showlogo='+whenNotFound);
            result = false;
            break;
    }
    //return result;
}

function playAudio(sound, volume) {
    let audio = new Audio(sound);
    audio.volume = volume * .01;
    audio.play();
    return audio.duration;
}

function playVideo(video, volume, size, height) {
    var vid = document.getElementById("vid");
    //var goalAudio = document.getElementById("goalAudio");
    var soundVolume = volume;

    console.log('enter setVideo -  video=' + video + ' ,volume=' + volume + ', size=' + size + ', height=' + height);
    document.querySelector("video").setAttribute("src", video);
    document.querySelector("source").style.boxShadow = "0 0 30px #333";

    document.querySelector("video").style.height = size + "%";
    document.querySelector("video").style.width = size + "%";
    document.querySelector("video").style.top = height + "%";

    //document.querySelector("video").style.minheight = size+"%";

    vid.volume = soundVolume * .01;

    vid.play();
    $("#vid").fadeTo("slow", 1);

    $('#vid').on('ended', function () {
        $("#vid").fadeTo("slow", 0);
        $("#vid")[0].pause();
    });
    return vid.duration;
}

function setTexts(mText, sText, name) {
    const mainTextAnimationIn = '{mainTextAnimationIn}';
    const mainTextAnimationInSpeed = '{mainTextAnimationInSpeed}';

    const mainTextAnimationOut = '{mainTextAnimationOut}';
    const mainTextAnimationOutSpeed = '{mainTextAnimationOutSpeed}';

    const subTextAnimationIn = '{subTextAnimationIn}';
    const subTextAnimationInSpeed = '{subTextAnimationInSpeed}';

    const subTextAnimationOut = '{subTextAnimationOut}';
    const subTextAnimationOutSpeed = '{subTextAnimationOutSpeed}';


    /*console.log('MainText animation In is '+mainTextAnimationIn);
    console.log('MainText animation out is '+mainTextAnimationOut);
    console.log('subText animation In is '+subTextAnimationIn);
    console.log('subText animation out is '+subTextAnimationOut);*/

    //console.log('Check mText='+mText);
    if (!mText) {
        mText = "";
    } else {
        mText = mText.replace("USERNAME", name);
    }

    //console.log('Check sText='+sText);
    if (!sText) {
        sText = "";
    } else {
        sText = sText.replace("USERNAME", name);
    }

    let shoutout = document.createElement('div');
    shoutout.setAttribute("id", "mainText");

    let stname = document.createElement('div');
    stname.setAttribute("id", "subText");

    /*console.log('shoutout.innerHTML: '+shoutout.innerHTML);
    console.log('stname.innerHTML: '+stname.innerHTML);*/

    document.querySelector("#containerMain").innerHTML = "";
    document.querySelector("#containerSub").innerHTML = "";

    document.querySelector("#containerMain").innerHTML = mText;
    document.querySelector("#containerSub").innerHTML = sText;

    animateCSS('#containerMain', mainTextAnimationIn);
    animateCSS('#containerMain', mainTextAnimationInSpeed);

    animateCSS('#containerSub', subTextAnimationIn);
    animateCSS('#containerSub', subTextAnimationInSpeed);

    $("#containerMain").fadeTo(0, 500);
    $("#containerSub").fadeTo(0, 500);


    setTimeout(function () {
        document.querySelector("#containerMain").classList.remove('animated', mainTextAnimationIn);
        document.querySelector("#containerMain").classList.remove('animated', mainTextAnimationInSpeed);

        document.querySelector("#containerSub").classList.remove('animated', subTextAnimationIn);
        document.querySelector("#containerSub").classList.remove('animated', subTextAnimationInSpeed);

        animateCSS('#containerMain', mainTextAnimationOut);
        animateCSS('#containerMain', mainTextAnimationOutSpeed);
        $("#containerMain").fadeTo(500, 0);

        animateCSS('#containerSub', subTextAnimationOut);
        animateCSS('#containerSub', subTextAnimationOutSpeed);
        $("#containerSub").fadeTo(500, 0);

    }, notifDuration);

    setTimeout(function () {
        document.querySelector("#containerMain").innerHTML = "";
        document.querySelector("#containerSub").innerHTML = "";

        document.querySelector("#containerMain").classList.remove('animated', mainTextAnimationOut);
        document.querySelector("#containerMain").classList.remove('animated', mainTextAnimationOutSpeed);

        document.querySelector("#containerSub").classList.remove('animated', subTextAnimationOut);
        document.querySelector("#containerSub").classList.remove('animated', subTextAnimationOutSpeed);
    }, notifDuration + 2000);
}

function animateCSS(element, animationName) {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName)

    /*	function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)

            if (typeof callback === 'function') callback()
        }

    node.addEventListener('animationend', handleAnimationEnd)*/
}

function setImage(avatarURL, size, posVert) {

    document.querySelector("img").setAttribute("src", avatarURL);
    document.querySelector("img").style.boxShadow = "0 10px 10px 0px rgba(0, 0, 0, 0.4), 0 10px 20px 0px rgba(0, 0, 0, 0.4)";

    document.getElementById("image").style.top = posVert + "%"
    document.querySelector("img").style.height = size + "%";

    $("#image").fadeTo("slow", 1);

    /*	defaultImg: "{{defaultImage}}",
          defaultImgSize: {{defaultImageSize}},
          defaultImgHeight: {{imageHeight}}
    */

    setTimeout(function () {
        $("#image").fadeTo("slow", 0);
    }, notifDuration);

    setTimeout(function () {
        document.querySelector("img").setAttribute("src", '');
        document.querySelector("img").style.boxShadow = "";
    }, notifDuration + 2000);
}


function stringToAnimatedHTML(s, anim) {
    let stringAsArray = s.split('');
    stringAsArray = stringAsArray.map((letter) => {
        return `<span class="animated-letter ${anim}">${letter}</span>`
    });
    return stringAsArray.join('');
}

function isImage(url) {
    if (url)
        return (url.match(/\.(jpeg|jpg|gif|png|bmp|jfif)$/) != null);
    else
        return false;
}

function isVideo(url) {
    if (url)
        return (url.match(/\.(mov|mp4|avi|mkv|webm)$/) != null);
    else
        return false;
}

function getBoolean(value) {
    switch (value) {
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
        case "Show channel logo":
            return true;
        default:
            return false;
    }
};
