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
var userCityInput = $("#city-input");
// cities with spaces break the API call
var selectedCity = "";
var APIKey = "ad917aaaa96b4e27d19270a99cf00379";
var temp = "";

// on page load, generate buttons for saved cities from stored searches in local storage
function renderSavedCities() {
  var pulledCities = JSON.parse(localStorage.getItem("savedCitiesString"));
  if (pulledCities !== null) {
    // For each item in the pulledCities array,
    for (var i = 0; i < pulledCities.length; i++) {
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
  temp = selectedCity.replace(/\s/g, "+");
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
  savedCitiesDiv.append(savedCity);
  // userCityInput.textContent = "";
}

function getWeatherData() {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    temp +
    "&units=imperial&appid=" +
    APIKey;

  fetch(requestUrl)
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
    var clickedBtn = event.target;
    // selectedCity = clickedBtn.classList.value;
    selectedCity = $(this).attr("data-city");
    getWeatherData();
  });
}
