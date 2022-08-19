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
var forecastDiv = $("#five-day-forecast");
var userCityInput = $("#city-input");
var selectedCity = "";
var APIKey = "ad917aaaa96b4e27d19270a99cf00379";
var cityConcat = "";

// on page load, generate buttons for saved cities from stored searches in local storage
function renderSavedCities() {
  var pulledCities = JSON.parse(localStorage.getItem("savedCitiesString"));
  if (pulledCities !== null) {
    for (var i = pulledCities.length - 1; i > pulledCities.length - 7; i--) {
      if (pulledCities[i] !== null) {
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

// pulls current weather data for selected city and then calls for getUVIndex() and get5DayForecast()
function getWeatherData() {
  cityConcat = selectedCity.replace(/\s/g, "+");
  var currentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityConcat +
    "&units=imperial&appid=" +
    APIKey;
  console.log(cityConcat);
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
      getUVIndex(coordinates);
      get5DayForecast(coordinates);
    });
}

// broken function - ajax call now returning 403 Forbidden (worked before)
function getUVIndex() {
  // API limits pull requests to 50/day - when limit is reached, UV index will display "undefined"
  $.ajax({
    type: "GET",
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader(
        "x-access-token",
        "caac84741a9f139def111d72abe571ce"
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
      // capture daily forecast data
      function pullDays(i) {
        var cardDate = data.list[i].dt_txt.slice(5, 10);
        var icon = data.list[i].weather[0].icon;
        var description = data.list[i].weather[0].main;
        var temp = data.list[i].main.temp;
        var feelsLike = data.list[i].main.feels_like;
        var humid = data.list[i].main.humidity;
        var wind = data.list[i].wind.speed;

        var forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-cards");

        var forecastDate = document.createElement("h3");
        forecastDate.textContent = cardDate;
        var forecastDescription = document.createElement("h4");
        forecastDescription.textContent = description;
        var forecastIcon = document.createElement("i");
        forecastIcon.classList.add(icon);
        forecastCard.append(forecastDate);
        forecastCard.append(forecastIcon);
        forecastCard.append(forecastDescription);

        var forecastHi = document.createElement("p");
        forecastHi.textContent = "Temp: " + temp + " °F";
        var forecastLo = document.createElement("p");
        forecastLo.textContent = "Feels Like: " + feelsLike + " °F";
        forecastCard.append(forecastHi);
        forecastCard.append(forecastLo);

        var forecastHum = document.createElement("p");
        forecastHum.textContent = "Humidity: " + humid + " %";
        var forecastWind = document.createElement("p");
        forecastWind.textContent = "Wind Speed: " + wind + " MPH";
        forecastCard.append(forecastHum);
        forecastCard.append(forecastWind);

        forecastDiv.append(forecastCard);
      }
      pullDays(8);
      pullDays(16);
      pullDays(24);
      pullDays(32);
      pullDays(39);
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
for (var i = 0; i < savedCityBtns.length; i++) {
  savedCityBtns[i].addEventListener("click", function (event) {
    event.preventDefault();
    selectedCity = $(this).attr("data-city");
    getWeatherData(selectedCity);
  });
}
