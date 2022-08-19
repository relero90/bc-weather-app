var searchBtn = $("#search-btn");
var savedCitiesDiv = $("#saved-cities");
var currentCityHeader = $("#cityname-date");
var currentDate = new Date().toLocaleDateString("en-us", {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
});
var todaysTemp = $("#cur-temp");
var todaysWind = $("#cur-wind");
var todaysHumidity = $("#cur-humidity");
var todaysUV = $("#cur-UV");
var coordinates = {};
var userCityInput = $("#city-input");
var latitude = "";
var longitude = "";
var selectedCity = "";
var APIKey = "ad917aaaa96b4e27d19270a99cf00379";
var cityConcat = "";

// on page load, generate buttons for saved cities from stored searches in local storage
function renderSavedCities() {
  var pulledCities = JSON.parse(localStorage.getItem("savedCitiesString"));
  if (pulledCities !== null) {
    for (var i = pulledCities.length - 1; i > pulledCities.length - 7; i--) {
      var savedCity = document.createElement("button");
      savedCity.textContent = pulledCities[i];
      // savedCity.classList.add(pulledCities[i]);
      savedCity.setAttribute("data-index", i);
      savedCity.setAttribute("id", "btn-2");
      savedCity.setAttribute("data-city", pulledCities[i]);
      savedCitiesDiv.append(savedCity);
    }
  }
}
renderSavedCities();

// when user enters a new city and clicks "search", saves to local storage and appends a button for that city
function saveNewCity() {
  var savedCities = JSON.parse(localStorage.getItem("savedCitiesString")) || [];

  selectedCity = userCityInput.val();
  cityConcat = selectedCity.replace(/\s/g, "+");
  // console.log(selectedCity);

  console.log(selectedCity);
  savedCities.push(selectedCity);
  console.log(savedCities);

  var storedStringInput = JSON.stringify(savedCities);
  localStorage.setItem("savedCitiesString", storedStringInput);
  // create button element, add text, class, and append below search
  var savedCity = document.createElement("button");
  savedCity.textContent = selectedCity;
  // savedCity.classList.add(selectedCity);
  savedCity.setAttribute("id", "btn-2");
  savedCitiesDiv.prepend(savedCity);
  savedCitiesDiv.children().eq(6).remove();
  // userCityInput.textContent = "";
}

function getWeatherData() {
  var currentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityConcat +
    "&units=imperial&appid=" +
    APIKey;
  console.log(currentUrl);

  fetch(currentUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      currentCityHeader.text(data.name + " - " + currentDate);
      todaysTemp.text(data.main.temp + " °F");
      todaysWind.text(data.wind.speed + " MPH");
      todaysHumidity.text(data.main.humidity + " %");
      // need UV index
      var latitude = data.coord.lat.toFixed(0);
      var longitude = data.coord.lon.toFixed(0);

      coordinates = {
        lat: latitude.toString(),
        lon: longitude.toString(),
      };
      console.log(coordinates);
      get5DayForecast(coordinates);
    });
}

function get5DayForecast() {
  console.log(coordinates);
  var forecastURL =
    "api.openweathermap.org/data/2.5/forecast?lat=" +
    coordinates.lat +
    "&lon=" +
    coordinates.lon +
    "&units=imperial&appid=" +
    APIKey;
  console.log(forecastURL);

  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

searchBtn.on("click", function (event) {
  event.preventDefault();
  if (userCityInput.val() !== null) {
    saveNewCity();
  }
  getWeatherData();
});

// When user clicks on any saved city button, get weather data for that city
var savedCityBtns = document.querySelectorAll("#btn-2");
console.log(savedCityBtns);
for (var i = 0; i < savedCityBtns.length; i++) {
  savedCityBtns[i].addEventListener("click", function (event) {
    event.preventDefault();
    selectedCity = $(this).attr("data-city");
    getWeatherData();
  });
}
