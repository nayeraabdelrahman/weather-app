var searchBTn=document.querySelector(".button-search");
var searchInput=document.querySelector("#search");
var WeatherTable=document.querySelector(".row.row-cols-1.row-cols-md-3.g-4");
var apiKey="1a363717602b4a2c99a04826240810";
let geocountry='';
  // Geolocation---------------------------------------
window.addEventListener("load",()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
    async function showPosition(position) {
        let latitude =position.coords.latitude;
        let longitude =position.coords.longitude;
        const geoApiUrl=`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        try {
            const response = await fetch(geoApiUrl);
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
                }
            const geoData = await response.json();
            geocountry = geoData.city || 'City not found';
            console.log(geocountry);
            getWeather(geocountry);
            }
        catch (error) {
            console.log(`Error: ${error.message}`);
            }
}})
    
//search city-----------------------------------------
searchBTn.addEventListener('click',function(){
    if(searchInput.value==''){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "please enter city",
        });
    }else if(searchInput.value.length>=3){
        searchCity(searchInput.value);
        lastcountry=searchInput.value;
    }
})
searchInput.addEventListener('input',function(e){
    if(e.target.value.length>=3){
        lastcountry=searchInput.value;
        searchCity(e.target.value);
    }
})

async function searchCity(countryinput){
    let response=await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${countryinput}`);
    try{
        if(!response.ok){
            throw new Error(`API error: ${response.statusText}`);
        }
        let data=await response.json();
        if(data.length==0){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "City is not found!",
            });
        }else{
            foundcountry=data[0].name;
            getWeather(foundcountry)
        }
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
        }
}
// get weather data for city---------------------------------
async function getWeather(country) {
    let response=await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=3`);
    try{
        if (!response.ok) {
            if (response.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Bad Request",
                    text: "The provided city name is invalid. Please try another one.",
                });}
                else{
                    throw new Error(`API error: ${response.statusText}`);
                }
            }
        let data=await response.json();
        displayWeather(data)
    }
    catch (error) {
        console.log(`Error: ${error.message}`);
        }
}
//check if celious---------------------------------------------
let celiousValue=true;
let lastcountry="";
document.querySelector(".btn-group.mb-3").addEventListener('click',function(e){
    if(e.target===document.querySelector(".celsius")){
        isCelsius('celsius');
    }else if(e.target===document.querySelector(".fahrenheit")){
        isCelsius('fahrenheit');
    }
})
function isCelsius(parameter) {
    if (parameter === 'celsius') {
        celiousValue = true; // Set to Celsius
        document.querySelector(".celsius").classList.add('active');
        document.querySelector(".fahrenheit").classList.remove('active');
    } else if (parameter === 'fahrenheit') {
        celiousValue = false; // Set to Fahrenheit
        document.querySelector(".fahrenheit").classList.add('active');
        document.querySelector(".celsius").classList.remove('active');
    }

    // Fetch the weather again for the current city after changing the unit
    if (lastcountry) {
        searchCity(lastcountry); // Prioritize fetching weather for last searched city
    } else if (geocountry) {
        searchCity(geocountry); // Fallback to geolocation city
    }
}


//wind direction---------------------------
function direction(letter){
    switch (letter) {
        case 'N':
            return 'North';
        case 'NNE':
            return ' North-Northeast';
        case 'ENE':
            return 'East-Northeast';
        case 'ESE':
            return ' East-Southeast';
        case 'SWS':
            return 'South-Southwest';
        case 'WNW':
            return 'West-Northwest';
        case 'NNW':
            return 'North-Northwest';
        case 'SSE':
            return 'South-SouthEest';
        case 'NE':
            return 'NorthWest'
        case 'E':
            return 'East';
        case 'SE':
            return 'SouthEast'
        case 'S':
            return 'South';
        case 'SW':
            return 'SouthWest'
        case 'W':
            return 'West';
        case 'NW':
            return 'NorthWest'
        default:
            return 'Invalid direction';
    }
}
//display weather------------------------------
function displayWeather(data){
    let location=data.location.name;
    let dateInfo=new Date(data.current.last_updated);
    let dayName=dateInfo.toLocaleString('en-us',{weekday:'long'});
    let dayNumber=dateInfo.toLocaleString('en-us',{day:'numeric'});
    let monthName=dateInfo.toLocaleString('en-us',{month:'long'});
    
    let weatherContent=`<div class="col">
                  <div class="card h-100">
                    <div class="card-header d-flex justify-content-between px-1" id="todayDate">
                      <div class="day">${dayName}</div>
                      <div class="D-today">${dayNumber} ${monthName}</div>
                    </div>
                    <div class="card-body">
                      <div class="location-city fs-5">${location}</div>
                      <div class="degree">
                        <div class="num text-light">${celiousValue?data.current.temp_c:data.current.temp_f}<sup>o</sup>${celiousValue?'C':'F'}</div>
                        <div class="forecast-icon">
                            <img src="https:${data.current.condition.icon}" alt="" width="90">
                        </div>	        
                    </div>
                    <div class="weather-summary fs-5">${data.current.condition.text}</div>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                      <span><img src="images/icon-umberella.png" alt=""><p class="ms-2 d-inline-block mb-0">${data.current.humidity}%</p></span>
                      <span><img src="images/icon-wind.png" alt=""><p class="ms-2 d-inline-block mb-0">${data.current.wind_kph}km/h</p></span>
                      <span><img src="images/icon-compass.png" alt=""><p class="ms-2 d-inline-block mb-0">${direction(data.current.wind_dir)}</p></span>
                    </div>
                  </div>
                </div>`
                var forecast="";
            for (let i = 1; i < data.forecast.forecastday.length; i++) {
                let nextDate = new Date(data.forecast.forecastday[i].date); 
                let nextDay=nextDate.toLocaleString('en-us',{weekday:'long'});
                forecast+=`<div class="col">
                <div class="card h-100 text-center">
                  <div class="card-header d-flex justify-content-center px-1" id="Date">
                    <div class="day">${nextDay}</div>
                  </div>
                  <div class="card-body">
                    <div class="degree">
                      <div class="forecast-icon">
                        <img src="https:${data.forecast.forecastday[i].day.condition.icon}" alt="" width="90">
                      </div>
                      <div class="L-num text-light fs-1">${celiousValue?data.forecast.forecastday[i].day.maxtemp_c:data.forecast.forecastday[i].day.maxtemp_f}<sup>o</sup>${celiousValue?'C':'F'}</div>
                      <small class="fs-5">2${celiousValue?data.forecast.forecastday[i].day.mintemp_c:data.forecast.forecastday[i].day.mintemp_f}<sup>o</sup>${celiousValue?'C':'F'}</small>	        
                  </div>
                  <div class="weather-summary fs-5">${data.forecast.forecastday[i].day.condition.text}</div>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                    <span><img src="images/icon-umberella.png" alt=""><p class="ms-2 d-inline-block mb-0">${data.forecast.forecastday[i].day.avghumidity}%</p></span>
                    <span><img src="images/icon-wind.png" alt=""><p class="ms-2 d-inline-block mb-0">${data.forecast.forecastday[i].day.maxwind_kph}km/h</p></span>
                    <span><img src="images/icon-compass.png" alt=""><p class="ms-2 d-inline-block mb-0">${direction(data.current.wind_dir)}</p></span>
                  </div>
                </div>
            </div>`
            }
            weatherContent+=forecast;
            WeatherTable.innerHTML=weatherContent;
}
//email subsceribe
document.querySelector("#sub-form").addEventListener('click',function(){
    var emailInput=document.querySelector('#email');
    var emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(emailInput.value===''){
        Swal.fire({
            icon: "error",
            text: "please enter your email",
        });
    }else{
        if(emailRegex.test(emailInput.value)){
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Thank you for subscribing!",
                showConfirmButton: false,
                timer: 1500
            });
            emailInput.value="";
        }else{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email is not true!",
            });
        }
    }
})