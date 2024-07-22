function isItRaining() {
  var rainChance = 0;
  if(document.getElementById('isRaining').checked == true) {
    rainChance += 100;
  }
  if(document.getElementById('isCloudy').checked == true) {
    rainChance += 40;
  }
  if(document.getElementById('isCold').checked == true) {
    rainChance += 10;
  }
  if(document.getElementById('isWindy').checked == true) {
    rainChance += 10;
  }
  if(document.getElementById('isPuddles').checked == true) {
    rainChance += 30;
  }
  if(document.getElementById('isWet').checked == true) {
    rainChance += 35;
  }
  if(document.getElementById('isHumid').checked == true) {
    rainChance += 10;
  }



  const rainingDet = document.getElementById('rainingDeterm');
  if(rainChance >= 100) {
    rainingDet.innerText = "It definitely is or was raining!"
  }
  else if(rainChance > 75) {
    rainingDet.innerText = "It probably is or was raining."
  }
  else if(rainChance > 50) {
    rainingDet.innerText = "It may have been raining, or it is about to."
  }
  else if(rainChance > 25) {
    rainingDet.innerText = "It's unlikely that it was raining, or even will rain."
  }
  else if(rainChance > 0) {
    rainingDet.innerText = "It wasn't raining, and it won't rain soon."
  }
  else {
    rainingDet.innerText = "Why would you think it's raining?"
  }
}

async function findRain(userLat, userLon, radiusKm, stepKm) {
    const closestRain = document.getElementById('closestRain');
    const whereBtn = document.getElementById('whereBtn');
    whereBtn.disabled = true;
    closestRain.innerText = "Thinking, one moment...";

    try {
      const response = await axios.get('/find-rain', {
        params: { lat: userLat, lon: userLon, radiusKm: radiusKm, stepKm: stepKm }
      });
      const data = response.data;
      closestRain.innerText = data.message;
    } 
    catch (error) {
        console.error('Error finding rain:', error);
    }
    
    whereBtn.disabled = false;
}
