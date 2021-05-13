const APIKEY = '3eb0dd06e20039885dbd431b866b157c';
let data;
//HTML variables
const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempDegree = document.querySelector('.tempDegree');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');
const weatherLocationButton = document.getElementById('weatherLocationButton');

weatherLocationButton.addEventListener('click', displayLocalWeather);

function displayLocalWeather(e) {
  e.preventDefault();
  defineLocationWeather();
  showAndHideDisplays();
  inputField.value = '';
  inputField.focus();
}



function defineLocationWeather() {
  let long;
  let lat;

  // Accesing Geolocation of User
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIKEY}&units=${unit}`;

      // Using fetch to get data
      getResouces(base)
        .then((data) => {
          setLocationData(data);
        })
        .catch(function(error) {
          console.log("We cannot acces your location!",error)
        });
    })
  };
}


function setLocationData(data) {
  let degree = checkDegreeInCelsiusAndFarenheit();
  const {
    description,
    icon
  } = data.weather[0];
  const place = data.name;
  const {
    temp
  } = data.main;
  const {
    sunrise,
    sunset
  } = data.sys;
  
  
  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  const sunriseGMT = new Date(sunrise * 1000);
  const sunsetGMT = new Date(sunset * 1000);

  iconImg.src = iconUrl;
  loc.textContent = `${place}`;
  desc.textContent = `${description}`;
  tempDegree.textContent = `${temp.toFixed(1)} °${degree}`;
  sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
  sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;

  setTermometerColor(temp, degree);

}

function setTermometerColor(temperature, degrees) {
  const termometer = document.querySelector('.fa-temperature-low');
  if((temperature > 20) && (degrees === 'C'))  {
     termometer.style.color = 'red';
  }
  if((temperature > 68) && (degrees === 'F'))  {
    termometer.style.color = 'red';
  }
}

function showAndHideDisplays() {
  locationWeather.classList.remove('display');
  document.getElementById("weeklyForcast").classList.add('display');
  document.getElementById('weatherNowSection').classList.add('display');
  inputContainer.classList.add('locationWeather');
  weatherLocationButton.classList.add('display');
}