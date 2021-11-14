// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: sun;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

// Instructions::
// Create an API key for your account - openweathermap.org
// Set your API key in the API_KEY column
// Fetch the longitude and latitude for your location of interest
// Replace the longitude, latitude and YOUR_API_KEY in the given link http://api.openweathermap.org/data/2.5/weather?lat=Latitude&lon=Longitude&appid=YOUR_API_KEY&units=metric and look for your City ID in the JSON text.
// Set your city identifier to CITY_WEATHER

// Variables
let API_WEATHER = "API_KEY // Paste your API key here
let CITY_WEATHER = "CITY_ID"; // Paste your City ID here
let UNIT_TYPE = "F"; // C for Celcius and F for Fahrenheit

// Create Data
var today = new Date();

// Initialize iOS/iPadOS Widget
let widget = new ListWidget(); 

// Fetch Storage
var base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";
var fm = FileManager.iCloud();

// Colors
var textcolor = new Color("#ffffff");

// Get Formatted Time
function getformatteddate(){
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[today.getMonth()] + " " + today.getDate();
}

// Get Random Integer (inclusive both ends)
async function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Fetch Image from Url
async function fetchimageurl(url) {
	const request = new Request(url);
	var res = await request.loadImage();
	return res;
}


// Load image from local drive
async function fetchimagelocal(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
    console.log("file exists: " + finalPath);
    return finalPath;
  }else{
    //throw new Error("Error file not found: " + path);
    if(fm.fileExists(base_path)==false){
      console.log("Directry not exist creating one.");
      fm.createDirectory(base_path);
    }
    console.log("Downloading file: " + finalPath);
    await downloadimg(path);
    if(fm.fileExists(finalPath)==true){
      console.log("file exists after download: " + finalPath);
      return finalPath;
    }else{
      throw new Error("Error file not found: " + path);
    }
  }
}

async function downloadimg(path){ // 01d_ico is example input
  imgurl = null;

  if(path.includes("bg")==true){
    // requesting image
    imgurl = "https://raw.githubusercontent.com/squishycat92/WeatherFrog/main/dep/media/"+imagebackgroundsized+".jpg";
    console.log("tried");
} else {
    // requesting icon
    imgurl = "https://raw.githubusercontent.com/squishycat92/WeatherFrog/main/dep/media/"+path+".png";
  }

  const image = await fetchimageurl(imgurl);
  console.log("Downloaded Image");
  fm.writeImage(base_path+path+".png",image);
}

//get Json weather
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}

// Get Location 
let unit_id = "";
let unit_s = "";
if(UNIT_TYPE=="F"){
  unit_id = "imperial";
  unit_s = "\u2109";
}else{
  unit_id = "metric";
  unit_s = "\u2103";
}

let weatherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=" + unit_id;
//"http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric"

const weatherJSON = await fetchWeatherData(weatherurl);
const cityName = weatherJSON.name;
const weatherarray = weatherJSON.weather;
const iconData = weatherarray[0].icon;
const weathername = weatherarray[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;

// Widget Background Image
imagebackgroundsized = null;
switch (iconData) {
  case '01d':
    imagebackgroundsized = iconData+"_bg-"+String(await getRandomInt(1,7));
    break;
  case '01n':
    imagebackgroundsized = iconData+"_bg-"+String(await getRandomInt(1,5));
    console.log("yes");
    break;
  case '02d':
    imagebackgroundsized = iconData+"_bg-"+String(await getRandomInt(1,3));
    break;
  case '02n':
    imagebackgroundsized = iconData+"_bg-"+String(await getRandomInt(1,2));
    break;
  case '03d':
    imagebackgroundsized = iconData+"_bg-"+String(await getRandomInt(1,8));
    break;
  case '03n':
    imagebackgroundsized = iconData+"_bg-"+String(await getRandomInt(1,3));
    break;
  case '04d':
    imagebackgrondsized = iconData+"_bg-"+String(await getRandomInt(1,3));
    break;
  case '04n':
    imagebackgrondsized = iconData+"_bg-"+String(await getRandomInt(1,2));
    break;
  case '09d':
    imagebackgrondsized = iconData+"_bg-"+String(await getRandomInt(1,2));
    break;
  case '09n':
    imagebackgrondsized = iconData+"_bg-1";
    break;
  case '10d':
    imagebackgrondsized = iconData+"_bg-1";
    break;
  case '10n':
    imagebackgrondsized = iconData+"_bg-1";
    break;
  case '11d':
    imagebackgrondsized = iconData+"_bg-1";
    break;
  case '11n':
    imagebackgrondsized = iconData+"_bg-1";
    break;
  case '13d':
    imagebackgrondsized = iconData+"_bg-"+String(await getRandomInt(1,2));
    break;
  case '13n':
    imagebackgrondsized = iconData+"_bg-";
    break;
  case '50d':
    imagebackgrondsized = iconData+"_bg-";
    break;
  case '50n':
    imagebackgrondsized = iconData+"_bg-";
    break;
}
widget.backgroundImage = Image.fromFile(await fetchimagelocal(imagebackgroundsized));

//Start Spacing
widget.addSpacer(0);

//Widget Weather Image
var img = Image.fromFile(await fetchimagelocal(iconData+"_ico"));
var widgetimg = widget.addImage(img);
widgetimg.imageSize = new Size(74,74);
widgetimg.rightAlignImage();

// Widget Weather Conditions
var dateText = widget.addText(weathername);
dateText.textColor = textcolor;
dateText.font = Font.regularSystemFont(15);

// Widget Temperature
var tempText = widget.addText(Math.round(curTemp)+unit_s);
tempText.textColor = textcolor;
tempText.font = Font.boldSystemFont(45);

// Widget Feels Like
let feel = "Feels like " + Math.round(feel_like) + unit_s; //"H:"+highTemp+"\u2103"+" L:"+lowTemp+"\u2103"
var hltempText = widget.addText(feel);
hltempText.textColor = textcolor;
hltempText.font = Font.regularSystemFont(15);

// High/Low Temperature
let wHigh = "H: "+Math.round(highTemp)+unit_s+"  L: "+Math.round(lowTemp)+unit_s;
var wHighText = widget.addText(wHigh);
wHighText.textColor = textcolor;
wHighText.font = Font.regularSystemFont(15);



// Bottom Spacer
widget.addSpacer();
//widget.setPadding(5, 15, 0, 15)

Script.setWidget(widget);
