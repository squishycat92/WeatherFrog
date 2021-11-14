// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// Create your ID on openweathermap.org
// Get your api from there and set that in API_WEATHER
// Add your API key and the run the script in the scriptable app
// The City ID for your current location will appear in the log section of Scriptable (accessed through the three dots). 

//API_KEY
let API_WEATHER = "YOUR_API_KEY"; // Paste your API Key here

Location.setAccuracyToBest();
let curLocation = await Location.current();
console.log(curLocation.latitude);
console.log(curLocation.longitude);
let url = "http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";

const data = await fetchWeatherData(url);
console.log("City Name: " + data.name);
console.log("City ID: " + data.id);

//get Json weather
async function fetchWeatherData(url) {
    const request = new Request(url);
    const res = await request.loadJSON();
    return res;
  }
