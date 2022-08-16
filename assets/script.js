var savedCitiesDiv = $("#saved-cities");
var currentCityHeader = $("#cityname-date");
var todaysTemp = $("#cur-temp");
var todaysWind = $("#cur-wind");
var todaysHumidity = $("#cur-humidity");
var todaysUV = $("#cur-UV");

function getWeatherData() {
  // Insert the API url to get weather information
  // Returning unauthorized - OpenWeather email says it needs a couple hours to activate my API keys
  var requestUrl = "https://api.openweathermap.org/data/3.0/onecall?appid={}";

  fetch(requestUrl).then(function (response) {
    console.log(response);
    return response.json();
  });
}
getWeatherData();
