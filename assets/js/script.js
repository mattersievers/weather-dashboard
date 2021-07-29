var formEl = document.querySelector("#city-search-form");
var inputEl = document.querySelector("#input-city-name")

//Submit button is clicked
var submitButtonHandler = function(event) {
  event.preventDefault();
  var currentCity = inputEl.value.trim();
  if(currentCity) {
    inputEl.value = "";
    getWeather(currentCity);
  } else {
      alert("Please enter a city.")
  }  
};

var getWeather = function(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a5bd61827c7f6e73efae30569b5a38fa")
    .then(function(response){
      return response.json()
    })
    .then(function(data){
        console.log(data);
    });
}

getWeather("Austin");
/*
- Grab name of city from input.

- get lat and long of city geocode coordinates of city
- plug lat and long to openweather
- retrieve information
-plug information into current-weather
-plug information into 5 day
-save city search under the previous-city-holder
*/

//event listener for Search button
formEl.addEventListener("submit", submitButtonHandler);