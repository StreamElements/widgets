//TTS Service
var SpeechSDK;
var synthesizer;
var speechConfig1;
speechConfig1 = SpeechSDK.SpeechConfig.fromSubscription("{{APIKey}}", "{{Region}}");
speechConfig1.speechSynthesisVoiceName = "{{VoiceName}}";
synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig1);
//------------


window.addEventListener('onWidgetLoad', function (obj) {
  BingTTS("TTS is Load."); //Test TTS when the widget is loaded and you can comment on it.
});
                        
window.addEventListener('onEventReceived', function (obj) {
    const listener = obj.detail.listener;
    const data = obj["detail"]["event"];

  	window.console.log("--------------------");
  	window.console.log(data);
  	window.console.log("--------------------");
  	window.console.log(listener);
  	window.console.log("--------------------");
	let FLMsg = '{{follower_latest}}'
    let SLMsg = '{{subscriber_latest_RESub}}'
    let RSLMsg = '{{subscriber_latest}}'
    let RaidMsg = '{{raid_latest}}'
    let HostMsg = '{{host_latest}}'
	

  	var UserName = String(data["name"]);
  	if (String(listener) == "follower-latest"){
    	if (UserName != "undefined"){
          	FLMsg = FLMsg.replace("{name}", UserName);
			//BingTTS(UserName + "，追隨了你的頻道。");
            BingTTS(FLMsg);
    	}//-------------------------------------------------------------------------
    }else if (String(listener) == "subscriber-latest"){
    	if (UserName != "undefined"){
          	if (data["amount"] >= 2){
              SLMsg = SLMsg.replace("{name}", UserName);
              SLMsg = SLMsg.replace("{amount}", data["amount"]);
              SLMsg = SLMsg.replace("{message}", data["message"]);
              BingTTS(SLMsg);
            }else{
              RSLMsg = RSLMsg.replace("{name}", UserName);
              BingTTS(RSLMsg);
            }
			//BingTTS(UserName + "，訂閱了第"+ String(data["amount"]) +"個月。" + String(data["message"]) );
          	
    	}//-------------------------------------------------------------------------
    }else if (String(listener) == "raid-latest"){
      	if (UserName != "undefined"){
          	RaidMsg = RaidMsg.replace("{name}", UserName);
            RaidMsg = RaidMsg.replace("{amount}", data["amount"]);
          
			//BingTTS(UserName + "，揪了"+ String(data["amount"]) +"位觀眾。" );
          	BingTTS(RaidMsg);
    	}//-------------------------------------------------------------------------
    }else if (String(listener) == "host-latest"){ 
    	if (UserName != "undefined"){
          	HostMsg = HostMsg.replace("{name}", UserName);
            HostMsg = HostMsg.replace("{amount}", data["amount"]);
			//BingTTS(UserName + "，轉播了你的頻道給"+ String(data["amount"]) +"位觀眾。" );
          	BingTTS(HostMsg);
    	}//-------------------------------------------------------------------------
    }  	
    //You can use vanilla JS as well
});

async function BingTTS(Ttttttt) {	
    await synthesizer.speakTextAsync(
        String(Ttttttt),
        function(result) {
          window.console.log(result);
        },
        function(err) {
          window.console.log(err);
        });
}


