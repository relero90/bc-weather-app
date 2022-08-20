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
var todaysIcon = $("#wicon");
var todaysWind = $("#cur-wind");
var todaysHumidity = $("#cur-humidity");
var todaysUV = $("#cur-UV");
var coordinates = {};
var forecastDiv = $("#five-day-forecast");
var userCityInput = $("#city-input");
var selectedCity;
var APIKey = "ad917aaaa96b4e27d19270a99cf00379";
var cityConcat = "";

// on page load, generate buttons for saved cities from stored searches in local storage
function renderSavedCities() {
  var pulledCities = JSON.parse(localStorage.getItem("savedCitiesString"));
  if (pulledCities !== null) {
    // for (var i = pulledCities.length - 1; i > pulledCities.length - 7; i--) {
    for (var i = 0; i < pulledCities.length; i++) {
      if (pulledCities[i] !== null) {
        var savedCity = document.createElement("button");
        savedCity.textContent = pulledCities[i];
        savedCity.setAttribute("data-index", i);
        savedCity.setAttribute("id", "btn-2");
        savedCity.setAttribute("data-city", pulledCities[i]);
        savedCitiesDiv.prepend(savedCity);
        savedCitiesDiv.children().eq(6).remove();
      }
    }
  }
}
renderSavedCities();

// when user enters a new city and clicks "search", saves to local storage and appends a button for that city
function saveNewCity() {
  var savedCities = JSON.parse(localStorage.getItem("savedCitiesString")) || [];

  selectedCity = userCityInput.val();
  cityConcat = selectedCity.replace(/\s/g, "+");
  console.log(selectedCity);

  savedCities.push(selectedCity);
  console.log(savedCities);

  var storedStringInput = JSON.stringify(savedCities);
  localStorage.setItem("savedCitiesString", storedStringInput);
  // create button element, add text, class, and append below search
  var savedCity = document.createElement("button");
  savedCity.textContent = selectedCity;
  savedCity.setAttribute("id", "btn-2");
  savedCitiesDiv.prepend(savedCity);
  // remove old button element to keep saved searches to 6
  savedCitiesDiv.children().eq(6).remove();
}

// pulls current weather and lat/lon data for selected city and then calls for getUVIndex() and get5DayForecast()
function getWeatherData() {
  cityConcat = selectedCity.replace(/\s/g, "+");
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
      currentCityHeader.text(
        data.name + " - " + currentDate + " - " + data.weather[0].main
      );
      // render icon
      var iconCode = data.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      todaysIcon.attr("src", iconUrl);
      console.log(todaysIcon);

      todaysTemp.text(data.main.temp + " °F");
      todaysWind.text(data.wind.speed + " MPH");
      todaysHumidity.text(data.main.humidity + " %");
      var latitude = data.coord.lat.toFixed(0);
      var longitude = data.coord.lon.toFixed(0);

      coordinates = {
        lat: latitude.toString(),
        lon: longitude.toString(),
      };
      getUVIndex(coordinates);
      get5DayForecast(coordinates);
    });
}

// Needed different API for UV index b/c OpenWeather will not provide with a free account
// OpenUV API limits pull requests to 50/day - when limit is reached, call returns 403 Forbidden and UV index on app will display color-coded "undefined"
function getUVIndex() {
  $.ajax({
    type: "GET",
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader(
        "x-access-token",
        "28d6ec7e91368103019573eb7cafdb26"
      );
    },
    // values for coordinates{} come from getWeatherData() function
    url:
      "https://api.openuv.io/api/v1/uv?lat=" +
      coordinates.lat +
      "&lng=" +
      coordinates.lon,

    success: function (response) {
      console.log(response);
      var UVIndex = response.result.uv.toFixed(2);
      todaysUV.text(UVIndex);

      if (UVIndex <= 3) {
        todaysUV.attr("class", "favorable");
      } else if (UVIndex > 3 && UVIndex <= 6) {
        todaysUV.attr("class", "moderate");
      } else if (UVIndex > 6 && UVIndex <= 8) {
        todaysUV.attr("class", "high");
      } else if (UVIndex > 8 && UVIndex <= 11) {
        todaysUV.attr("class", "veryhigh");
      } else {
        todaysUV.attr("class", "severe");
      }
    },
    error: function () {
      todaysUV.text("unavailable");
      todaysUV.attr("class", "unavailable");
    },
  });
}

// Pull relevant data from API fetch and populate forecast cards
function get5DayForecast() {
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    coordinates.lat +
    "&lon=" +
    coordinates.lon +
    "&units=imperial&appid=" +
    APIKey;

  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      forecastDiv.children().remove();
      // capture daily forecast data for index point i
      function pullDays(i) {
        // pulls relevant data from API call
        var cardDate = data.list[i].dt_txt.slice(5, 10);
        var iconCode = data.list[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var temp = data.list[i].main.temp;
        var feelsLike = data.list[i].main.feels_like;
        var humid = data.list[i].main.humidity;
        var wind = data.list[i].wind.speed;
        // Creates forecast card and appends to DOM
        var forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-cards");
        var forecastDate = document.createElement("h3");
        forecastDate.textContent = cardDate;
        var headerDiv = document.createElement("div");
        headerDiv.classList.add("flexDiv");
        var forecastIcon = document.createElement("img");
        forecastIcon.src = iconUrl;
        headerDiv.append(forecastIcon);
        forecastCard.append(forecastDate);
        forecastCard.append(headerDiv);
        var forecastTemp = document.createElement("p");
        forecastTemp.textContent = "Temp: " + temp + " °F";
        var forecastFL = document.createElement("p");
        forecastFL.textContent = "Feels Like: " + feelsLike + " °F";
        forecastCard.append(forecastTemp);
        forecastCard.append(forecastFL);
        var forecastHum = document.createElement("p");
        forecastHum.textContent = "Humidity: " + humid + " %";
        var forecastWind = document.createElement("p");
        forecastWind.textContent = "Wind: " + wind + " MPH";
        forecastCard.append(forecastHum);
        forecastCard.append(forecastWind);
        forecastDiv.append(forecastCard);
      }
      // data index points for each of 5 days
      pullDays(8);
      pullDays(16);
      pullDays(24);
      pullDays(32);
      pullDays(39);
    });
}

// When user clicks on the search button, if they have entered a city, get weather data for that city
searchBtn.on("click", function (event) {
  event.preventDefault();
  if (userCityInput.val() !== null) {
    saveNewCity();
  }
  getWeatherData(selectedCity);
  userCityInput.value = "";
});

// When user clicks on any saved city button, get weather data for that city
var savedCityBtns = document.querySelectorAll("#btn-2");
for (var i = 0; i < savedCityBtns.length; i++) {
  savedCityBtns[i].addEventListener("click", function (event) {
    event.preventDefault();
    selectedCity = $(this).attr("data-city");
    getWeatherData(selectedCity);
  });
}
