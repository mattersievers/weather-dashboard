var formEl = document.querySelector("#city-search-form");
var inputEl = document.querySelector("#input-city-name");
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayEl = document.querySelector("#five-day-forecast");
var cities = [];

//Submit button is clicked
var submitButtonHandler = function(event) {
  event.preventDefault();
  var inputCity = inputEl.value.trim();
  if(inputCity) {
    inputEl.value = "";
    fiveDayEl.innerHTML ="";
    generateDailyWeather(inputCity);
  } else {
      alert("Please enter a city.")
  }  
};

var generateDailyWeather = function(city) {
    //grab forecast information from api
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=a5bd61827c7f6e73efae30569b5a38fa")
    .then(function(response){
      if(response.ok) {
        response.json()
        .then(function(forecastData){
            var iconType = forecastData.list[0].weather[0].icon;
            var momentObj = moment(forecastData.list[0].dt_txt,'YYYY/MM/DD LT');
            var lat = forecastData.city.coord.lat;
            var lon = forecastData.city.coord.lon;
            //grab uvi info from different api
            return fetch ("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,daily,alerts&units=imperial&appid=a5bd61827c7f6e73efae30569b5a38fa")
            .then(function(response){
                response.json()
                .then(function(uviData){
                    //create single day forcast
                    var headerEl = document.querySelector("#city-name");
                    headerEl.innerHTML = forecastData.city.name +" ("+ momentObj.format('MM/DD/YY') + ")<img src='http://openweathermap.org/img/wn/"+iconType+"@2x.png'>";
                    var listEl = document.querySelector("#city-info");
                    listEl.innerHTML = 
                    "<li>Temp: "+forecastData.list[0].main.temp+" °F</li>"+
                    "<li>Wind: "+forecastData.list[0].wind.speed+" MPH</li>"+
                    "<li>Humidity: "+forecastData.list[0].main.humidity+" %</li>"+
                    "<li>UV Index: <span>"+uviData.current.uvi+"</span></li>";
                    currentWeatherEl.style.border="1px solid black";
                    //fill in 5 day forcast
                    //title
                    var fiveHeadingEl = document.querySelector("#five-day-heading");
                    fiveHeadingEl.innerHTML = "<h3>5-Day Forecast:</h3>";
                    
                    //iterate over for loop 5 times, once for each day
                    for (var i=7; i < forecastData.list.length + 1 ; i+=8)  {
                        var currentDay = moment(forecastData.list[i].dt_txt,'YYYY/MM/DD LT');
                        var containerEl = document.createElement("div");
                        containerEl.classList = "col-2";
                        containerEl.innerHTML =
                        "<ul><li>"+currentDay.format('MM/DD/YYYY')+"</li>" +
                        "<li><img src='http://openweathermap.org/img/wn/"+forecastData.list[i].weather[0].icon+"@2x.png'></li>"+
                        "<li>Temp: "+ forecastData.list[i].main.temp +" °F</li>" +
                        "<li>Wind: "+forecastData.list[i].wind.speed+" MPH</li>" +
                        "<li>Humidity: "+forecastData.list[i].main.humidity+" %</li>" +
                        "</ul>";

                        fiveDayEl.appendChild(containerEl);

                    }
                })
            })      
        });
      } else {
          alert("Unable to find the city entered. Please check the spelling and try again.");
      }
    });  
}

var createDailyWeather = function(){

};
var createFutureWeather = function(){

};
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