var savedCitiesDiv = $("#saved-cities");
var currentCityHeader = $("#cityname-date");
var todaysTemp = $("#cur-temp");
var todaysWind = $("#cur-wind");
var todaysHumidity = $("#cur-humidity");
var todaysUV = $("#cur-UV");
// city input needs to be a string when it goes into requestUrl
var userCityInput = $("#city-input");
var selectedCity = "";
var APIKey = "ad917aaaa96b4e27d19270a99cf00379";

console.log(userCityInput.value);

function getWeatherData() {
  // API url to get current weather information
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    selectedCity +
    "&appid=" +
    APIKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
// getWeatherData();
