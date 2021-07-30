var formEl = document.querySelector("#city-search-form");
var inputEl = document.querySelector("#input-city-name");
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayEl = document.querySelector("#five-day-forecast");
var buttonHolderEl = document.querySelector("#previous-city-holder");
var cities = [];

//Submit button is clicked
var submitButtonHandler = function(event) {
  event.preventDefault();
  var inputCity = inputEl.value.trim();
  if(inputCity) {
    inputEl.value = "";
    fiveDayEl.innerHTML ="";
    generateDailyWeather(inputCity,true);
  } else {
      alert("Please enter a city.")
  }  
};

var generateDailyWeather = function(city,initial) {
    //grab forecast information from api
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=a5bd61827c7f6e73efae30569b5a38fa")
    .then(function(response){
      if(response.ok) {
        response.json()
        .then(function(forecastData){
            var iconType = forecastData.list[0].weather[0].icon;           
            var lat = forecastData.city.coord.lat;
            var lon = forecastData.city.coord.lon;
            //grab uvi info from different api
            return fetch ("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,daily,alerts&units=imperial&appid=a5bd61827c7f6e73efae30569b5a38fa")
            .then(function(response){
                response.json()
                .then(function(uviData){
                    
                    //create single day forecast
                    var headerEl = document.querySelector("#city-name");
                    headerEl.innerHTML = forecastData.city.name +" ("+ moment().format('MM/DD/YY') + ")<img src='http://openweathermap.org/img/wn/"+iconType+"@2x.png'>";
                    var listEl = document.querySelector("#city-info");

                    listEl.innerHTML = 
                    "<li>Temp: "+uviData.current.temp+" °F</li>"+
                    "<li>Wind: "+uviData.current.wind_speed+" MPH</li>"+
                    "<li>Humidity: "+uviData.current.humidity+" %</li>"+
                    "<li>UV Index: <span id='color-span'>"+uviData.current.uvi+"</span></li>";
                    currentWeatherEl.style.border="1px solid black";
                    colorCode(uviData.current.uvi);

                    //if city is put in first as opposed to recalling
                    if(initial){
                    saveCity(forecastData.city.name);
                    }
                    //fill in 5 day forecast
                    //title
                    var fiveHeadingEl = document.querySelector("#five-day-heading");
                    fiveHeadingEl.innerHTML = "<h3>5-Day Forecast:</h3>";
                    
                    //iterate over for loop 5 times, once for each day
                    for (var i=0; i < forecastData.list.length ; i+=8)  {
                        var currentDay = moment(forecastData.list[i].dt_txt,'YYYY/MM/DD LT');
                        var containerEl = document.createElement("div");
                        containerEl.classList = "col-lg-2 col-md-6 col-sm-12 card five-day";
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


var saveCity = function(city) {
 //retrieve stored list
 var tempCities = JSON.parse(localStorage.getItem("cities"));
 if(!tempCities){
     tempCities = []; 
 }   
 cities = tempCities


 
 cities.push(city);

 for (var i=0; i < cities.length-1 ; i++) {
     if (city === cities[i]){
       cities.splice(cities.length-1,1);   
     }
 }


 //store only eight cities
 if (cities.length > 6){
   cities.splice(0,1);
 }
 localStorage.setItem("cities",JSON.stringify(cities));
 loadCities();
};

//Grab cities from localStorage and generate buttons
var loadCities = function() {
    var tempCities = JSON.parse(localStorage.getItem("cities"));
 
    if(!tempCities){
        tempCities = []; 
    }
    
    //clear previous buttons
    buttonHolderEl.innerHTML="";

    //build the buttons
    for (var i=0; i< tempCities.length; i++){
        var buttonEl = document.createElement("button");
        buttonEl.textContent = tempCities[i];
        buttonEl.classList = "btn btn-secondary btn-small";
        buttonHolderEl.appendChild(buttonEl);
    }
}
//Load on startup
loadCities();

//color codes the UV index span element
var colorCode = function(uvi) {
    var spanEl = document.querySelector("#color-span");
    uvi = Number(uvi)
    if (uvi >= 8) {
        spanEl.classList.remove("green","yellow");
        spanEl.classList = "red";
    } else if (uvi < 8 && uvi >=3) {
        spanEl.classList.remove("red","green");
        spanEl.classList = "yellow";     
    } else if (uvi<3) {
        spanEl.classList.remove("red", "yellow")
        spanEl.classList = "green"
    }
}

var previousCityHandler = function(event){
  event.preventDefault();
  if (event.target.matches(".btn")) {
  currentCity = event.target.textContent;
  fiveDayEl.innerHTML ="";
  generateDailyWeather(currentCity,false);
  }
}

//event listener for Search button
formEl.addEventListener("submit", submitButtonHandler);

buttonHolderEl.addEventListener("click", previousCityHandler)
/* 
- add buttons from localStorage
- add event listener for buttons
*/