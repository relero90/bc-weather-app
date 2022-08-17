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

// on page load, generate buttons for saved cities from stored searches in local storage
function renderSavedCities() {
  var pulledCities = JSON.parse(localStorage.getItem("savedCitiesString"));
  if (pulledCities !== null) {
    // For each item in the pulledCities array,
    for (var i = 0; i < pulledCities.length; i++) {
      var savedCity = document.createElement("button");
      savedCity.textContent = pulledCities[i];
      savedCity.classList.add(pulledCities[i]);
      savedCity.setAttribute("data-index", i);
      savedCitiesDiv.append(savedCity);
    }
  }
}
renderSavedCities();

// when user enters a new city and clicks "search", saves to local storage and appends a button for that city
function saveNewCity() {
  selectedCity = userCityInput.val();
  console.log(selectedCity);
  savedCities.push(selectedCity);
  console.log(savedCities);

  var storedStringInput = JSON.stringify(savedCities);
  localStorage.setItem("savedCitiesString", storedStringInput);
  // create button element, add text, class, and append below search
  var savedCity = document.createElement("button");
  savedCity.textContent = selectedCity;
  savedCity.classList.add(selectedCity);
  savedCitiesDiv.append(savedCity);
  // userCityInput.textContent = "";
}

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
  event.preventDefault();
  if (userCityInput.val() !== null) {
    saveNewCity();
  }
});
