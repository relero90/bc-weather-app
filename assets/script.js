var searchBtn = $("#search-btn");
var savedCitiesDiv = $("#saved-cities");
var savedCities = [];
var currentCityHeader = $("#cityname-date");
var todaysTemp = $("#cur-temp");
var todaysWind = $("#cur-wind");
var todaysHumidity = $("#cur-humidity");
var todaysUV = $("#cur-UV");
var userCityInput = $("#city-input");
// cities with spaces break the API call
var selectedCity = "";
var APIKey = "ad917aaaa96b4e27d19270a99cf00379";

function captureNewCity() {
  selectedCity = userCityInput.val();
  console.log(selectedCity);

  // overwrites self each time
  savedCities.push(selectedCity);
  var storedStringInput = JSON.stringify(savedCities);
  localStorage.setItem("savedCitiesString", storedStringInput);

  // create button element
  var savedCity = document.createElement("button");
  // add text = selected city
  savedCity.textContent = selectedCity;
  // add class = selected city
  savedCity.classList.add(selectedCity);
  // Append button to savedCitiesDiv
  savedCitiesDiv.append(savedCity);
}

function renderSavedCity() {}

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

searchBtn.on("click", function (event) {
  console.log(userCityInput.val());
  event.preventDefault();

  if (userCityInput.val() !== null) {
    captureNewCity();
  }
});
