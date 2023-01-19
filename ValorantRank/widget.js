window.addEventListener('onWidgetLoad', async function (obj){
   fieldData = obj.detail.fieldData 

   valorantBadge()
   showBadge()
   
   async function valorantBadge(){
     const getRankFetch = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${fieldData['region']}/${fieldData['username']}/${fieldData['tagline']}`)
     const getRankResponse = await getRankFetch.json()
     const rank = getRankResponse.data.currenttierpatched.toLowerCase()
     const points = getRankResponse.data.ranking_in_tier
     
     const getBadgesFetch = await fetch('https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04')
     const getBadgesResponse = await getBadgesFetch.json()
     const tier = getBadgesResponse.data.tiers.find(badge => badge.tierName.toLowerCase() === rank)
     
     document.getElementById('image-id').src = tier.largeIcon
     
     if(fieldData.showPoints === 'true'){       
      document.getElementById('points').innerText = `${points} points`
     }
          
     setTimeout(valorantBadge, 120000)
   }
   
   function showBadge(){    
     $("#valorant, #points").show().css('animation', `${fieldData.animEnter} ${fieldData.animEnterDuration}ms forwards`);  
     setTimeout(hideBadge, fieldData.showBadge * 1000)
   }
      
   function hideBadge(){
     $('#valorant').css('animation', `${fieldData.animExit} ${fieldData.animExitDuration}ms forwards`);
     setTimeout(showBadge, fieldData.hideBadge * 1000)
   }
})

window.addEventListener('onEventReceived', async function(obj) {
  
  if(obj.detail.listener !== "message") return
  
  const data = obj.detail.event.data
  const channel = data.channel		
  const user = data.nick
  const text = data.text  
  const valorantDiv = document.getElementById("valorant")
  
  const userState = { // Criar os perfis de usuário. Os valores são true/false/1/0. Exemplo: {mod: 1, sub: 1, vip: false, broadcaster: false}
    'mod': parseInt(data.tags.mod),
    'sub': parseInt(data.tags.subscriber),
    'vip': (data.tags.badges.indexOf("vip") !== -1),
    'broadcaster': user === channel
  }  
  
  if(text === fieldData.tempDisable && (userState.mod || userState.broadcaster)){
    valorantDiv.style.visibility = "hidden";
  }
  
  if(text === fieldData.tempEnable && (userState.mod || userState.broadcaster)){
    valorantDiv.style.visibility = "visible";  
  }
  
})
