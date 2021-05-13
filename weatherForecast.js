//Global variables
let unit;
let TEMP = "temperature";
let DEFAULT_TEMP = "celsius";

//variable for the API
const api = {
    urlNow: `https://api.openweathermap.org/data/2.5/weather?appid=94823af3fbf2a842eb5a86bb1c95efc3&units=metric&q=`,
    urlIcon: "http://openweathermap.org/img/w/"
}

//variables from HTML files
const inputField = document.getElementById('input');
const weatherNowButton = document.getElementById("weatherNowButton");
const weatherForcastbutton = document.getElementById("weatherForecastButton");
const displayElements = document.getElementById('description');
const daysForecast = document.getElementById('daysForecast');
const celsius = document.getElementById('celsius');
const farenheit = document.getElementById('farenheit');
const checkboxButtons = document.getElementsByName('temp');
const locationWeather = document.getElementById("locationWeather");
const inputContainer = document.querySelector('.inputContainer');

//Preference event listeners
celsius.addEventListener('change', () => {
    checkSelection(celsius);
    defineLocationWeather();
    currentWeather(inputField.value);
    forecastWeather(inputField.value);
});

farenheit.addEventListener('change', () => {
    checkSelection(farenheit);
    defineLocationWeather();
    currentWeather(inputField.value);
    forecastWeather(inputField.value);
});


window.addEventListener('load', () => {
    inputContainer.classList.add('locationWeather');
    setTemperatureMeasurement();
    defineLocationWeather();
});


//weather Now Event Listener
weatherNowButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (inputField.value !== '') {
        currentWeather(inputField.value);
        addAndRemoveClasses();
        document.getElementById('weatherNowSection').classList.remove('display');
        
    }
});

//weather forecast Event Listener
weatherForcastbutton.addEventListener('click', function (event) {
    event.preventDefault();
    if (inputField.value !== '') {
        forecastWeather(inputField.value);
        addAndRemoveClasses();
        document.getElementById("weeklyForcast").classList.remove('display');   
    }
});


inputField.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (inputField.value !== '') {
            currentWeather(inputField.value);
            forecastWeather(inputField.value);
            addAndRemoveClasses();
            document.getElementById('weatherNowSection').classList.remove('display');
            document.getElementById("weeklyForcast").classList.remove('display');
        }
    }
});


function checkSelection(parameter) {
    for (let i = 0; i < checkboxButtons.length; i++) {
        if (checkboxButtons[i].checked === true) {
            checkboxButtons[i].checked = false;
        }
        parameter.checked = true;
        updatePreference(parameter);
    };
};

// functions to define user preference with displaying temperature
function setTemperatureMeasurement() {
    let preference = getPreference();
    document.getElementById(preference).setAttribute('checked', true);
    if (preference === "celsius") {
        unit = "metric";
        return unit;
    } else {
        unit = "imperial";
        return unit;
    };
};

function getPreference() {
    let preference = localStorage.getItem(TEMP);
    if (preference !== "") {
        preference = getCookie(TEMP);
    }
    if (preference === "") {
        preference = DEFAULT_TEMP;
    }
    return preference;
};


function updatePreference(choice) {
    localStorage.setItem(TEMP, choice.id);
    document.cookie = `${TEMP}=${choice.id}`;
    unit = choice.value;
    return unit;
};

function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";

}


//weather now function to get server response
function currentWeather(city) {
    if (city !== '') {
        displayElements.innerHTML = "";
        let url = `https://api.openweathermap.org/data/2.5/weather?appid=94823af3fbf2a842eb5a86bb1c95efc3&units=${unit}&q=` + city;
        getResouces(url)
        .then(responseText => {
            showCurrentWeather(responseText);
            document.getElementById('weatherNowTitle').innerText = `Today's weather in "${inputField.value.toUpperCase()}":`;
            googleMap(inputField.value);
            document.getElementById('map').classList.remove('display');
        })
        .catch(function (error) {
            console.log('There is a location problem', error);
            document.getElementById('weatherNowTitle').innerText = `"${inputField.value.toUpperCase()}" is not a valid CITY!`;
            document.getElementById('map').classList.add('display');
        });
    }
};

function getResouces(url) {
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('There is a problem!')
    });
};


function checkDegreeInCelsiusAndFarenheit() {
    if (unit === "metric") {
        return "C";
    } else {
        return "F";
    }
}


// function to display the information for the current weather in the "weatherNow" div
function showCurrentWeather(newWeather) {
    let degree = checkDegreeInCelsiusAndFarenheit();

    let displayIcon = document.createElement('div');
    displayIcon.setAttribute('class', 'icon');
    displayIcon.innerHTML = `<img src=${api.urlIcon}${newWeather.weather[0].icon}.png >`;

    let weatherDescription = document.createElement('div');
    weatherDescription.setAttribute('id', 'weatherDescription');
    weatherDescription.innerHTML = `<p>Weather description: ${newWeather.weather[0].description}</p>`;

    let weatherPressure = document.createElement('div');
    weatherPressure.setAttribute('id', 'weatherPressure');
    weatherPressure.innerHTML = `<p>Weather Pressure: ${newWeather.main.pressure}</p>`;

    let weatherHumidity = document.createElement('div');
    weatherHumidity.setAttribute('id', 'weatherHumidity');
    weatherHumidity.innerHTML = `<p>Humidity: ${newWeather.main.humidity}</p>`;

    let currentTemp = document.createElement('div');
    currentTemp.setAttribute('id', 'currentTemperature');
    currentTemp.innerHTML = `<p>Current Temperature: ${newWeather.main.temp.toFixed(0)}&deg;${degree}</p>`;

    let dayMinimum = document.createElement('div');
    dayMinimum.setAttribute('id', 'dayMinimum');
    dayMinimum.innerHTML = `<p>Minimum temperature: ${newWeather.main.temp_min.toFixed(0)}&deg;${degree}</p>`;

    let dayMaximum = document.createElement('div');
    dayMaximum.setAttribute('id', 'dayMinimum');
    dayMaximum.innerHTML = `<p>Maximum temperature: ${newWeather.main.temp_max.toFixed(0)}&deg;${degree}</p>`;

    displayElements.appendChild(displayIcon);
    displayElements.appendChild(weatherDescription);
    displayElements.appendChild(weatherPressure);
    displayElements.appendChild(weatherHumidity);
    displayElements.appendChild(currentTemp);
    displayElements.appendChild(dayMinimum);
    displayElements.appendChild(dayMaximum);
}


//function to get the response from the server for the weather forecast
function forecastWeather(city) {
    if (city !== '') {
        daysForecast.innerHTML = "";
        let url = `https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=${unit}&q=` + city;
        getResouces(url)
        .then(responseText => {
            displayForecast(responseText);
            displayForecastHours(responseText);
            document.getElementById('weeklyForcastTitle').innerText = `Weather forecast in "${inputField.value.toUpperCase()}":`;
        })
        .catch(function (error) {
            console.log('There is a location problem', error);
            document.getElementById('weeklyForcastTitle').innerText = `"${inputField.value.toUpperCase()}" is not a valid CITY!`;
        });
    }
};


//function to create the day div and display the time for the forecast
function displayForecast(forecast) {
    let currentDay = forecast.list[0].dt_txt.split(" ")[0];
    let dayNumber = 1;
    let day = document.createElement('div');
    day.setAttribute('id', 'day' + dayNumber);
    day.innerHTML = '<p class="dateFormat">Day: ' + forecast.list[0].dt_txt.split(" ")[0] + '</p>';
    daysForecast.appendChild(day);

    for (let i = 0; i < forecast.list.length; i++) {
        if (currentDay != forecast.list[i].dt_txt.split(" ")[0]) {
            currentDay = forecast.list[i].dt_txt.split(" ")[0];
            dayNumber++
            day = document.createElement('div');
            day.setAttribute('id', 'day' + dayNumber);
            day.innerHTML = '<p class="dateFormat">Day: ' + forecast.list[i].dt_txt.split(" ")[0] + '</p>';
            daysForecast.appendChild(day);
        }
    }
}


// function to display the weather on hourly basis
function displayForecastHours(forecast) {
    let currentDay = forecast.list[0];
    let index = 1;

    for (i = 0; i < forecast.list.length; i++) {
        if (currentDay.dt_txt.split(' ')[0] === forecast.list[i].dt_txt.split(" ")[0]) {
            currentDay = forecast.list[i];
            showForecastInformation(currentDay, index);
        } else {
            currentDay = forecast.list[i];
            index++;
            showForecastInformation(currentDay, index);
        }
    }
}


//function to display informations regarding the forecast
function showForecastInformation(day, index) {
    let degree = checkDegreeInCelsiusAndFarenheit();
    let displayIcon = document.createElement('div');
    displayIcon.setAttribute('class', 'icon');
    displayIcon.innerHTML = `<img src=${api.urlIcon}${day.weather[0].icon}.png />`;

    let weatherHour = document.createElement('p');
    weatherHour.innerText = `Hour: ${day.dt_txt.split(" ")[1]}`;

    let weatherDescription = document.createElement('p');
    weatherDescription.innerText = `Description: ${day.weather[0].description}`;

    let currentTemperature = document.createElement('div');
    currentTemperature.innerHTML = `<p>Temperature: ${day.main.temp.toFixed(0)}&deg;${degree}</p>`;

    let dayContainer = document.createElement('div');
    dayContainer.classList.add("dayForecastContainer");
    document.getElementById("day" + index).appendChild(dayContainer);

    dayContainer.appendChild(weatherHour);
    dayContainer.appendChild(displayIcon);
    dayContainer.appendChild(weatherDescription);
    dayContainer.appendChild(currentTemperature);

}


//function to show the map and marker
function googleMap(city) {
    getResouces(api.urlNow + city)
        .then(response => {
            getMap(response);
        })
}

function getMap(newWeather) {
    let lat = newWeather.coord.lat;
    let lon = newWeather.coord.lon;

    var uluru = {
        lat: lat,
        lng: lon
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: uluru
    });

    new google.maps.Marker({
        position: uluru,
        map: map,
    });
    document.getElementById('map').style.height = "40vh";
}

function addAndRemoveClasses() {
    locationWeather.classList.add('display');
    inputContainer.classList.remove('locationWeather');
    weatherLocationButton.classList.remove('display');
}