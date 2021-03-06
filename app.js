// API keys

const WEATHER_API_KEY = '844783edbed1f571863cca4bfd7b84bc';

// Call all needed elements from html file

const searchBox = document.getElementById('searchBox');
const searchBtn = document.getElementById('searchBtn');

const city = document.querySelector('.city');
const temp = document.querySelector('.temp-field');
const humidity = document.querySelector('.humid-field');
const windSpeed = document.querySelector('.wind-speed');

const weatherContainer = document.querySelector('.weather');

let loading = true;

const loaderAnimation = `
<div class="lds-ripple"><div></div><div></div></div>
<p class="loading-text">Loading...</p>

`;

async function getLocationCoords(searchParam) {
  // loading = true;
  const coords = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${searchParam}&units=metric&limit=${1}&appid=${WEATHER_API_KEY}`
  )
    .then(res => {
      if (!res.ok) console.log(`Could not fetch data. Status: ${res.status}`);

      return res.json();
    })
    .catch(err => {
      console.log('Error: ' + err);
    });

  return coords;
}

async function getData(lattitude, longitude) {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
  )
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(`Error at: ${err}`);
    })
    .finally(() => {
      loading = !loading;
    });

  return weatherData;
}

async function displayData() {
  // loading = true;
  // Get Coordinates for the queried state
  const coords = await getLocationCoords(searchBox.value);
  const { lat, lon, name, country } = coords[0];

  // Get the temperature using geocode
  const data = await getData(lat, lon);

  const { description, icon } = data.weather[0];
  const { temp, temp_min, temp_max, humidity } = data.main;
  const { speed } = data.wind;

  weatherContainer.innerHTML = `
    <div class="city-wrapper">
      <h2 class="city">${name}, ${country}</h2>
    </div>
    <div class="main">
      <div class='temp'>
        <i class="fa-solid fa-temperature-three-quarters" style='color: orangered;'></i>
        <span class="temp-field">Temperature: ${temp}??</span>
      </div>
      <div class='weather-state'>
          <img src='https://openweathermap.org/img/w/${icon}.png' class='weather-icon' />
          <span class='weather-state-text'>${description}</span>
        </div>
      <div class='temp-minmax'>
          <div class='temp-min'>Min Temp: ${Math.trunc(temp_min)}??</div>
          <div class='temp-max'>Max Temp: ${Math.trunc(temp_max)}??</div>
        </div>
      <div class="humidity">
        <i class="fa-solid fa-droplet" style='color: aqua;'></i>
        <span class="humid-field">Humidity: ${humidity}</span>
      </div>
      <div class="wind">
        <i class="fa-solid fa-wind" style='color: steelblue;'></i>
        <span class="wind-speed"> Wind Speed: ${speed}km/h </span>
      </div>
    </div>
  `;

  searchBox.value = '';
  loading = !loading;
}

searchBtn.addEventListener('click', async e => {
  e.preventDefault();

  // hide the loader animation and display the weather data
  if (loading) {
    weatherContainer.innerHTML = loaderAnimation;
    await displayData();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (loading) {
    weatherContainer.innerHTML = `<h2 class='empty-search' style='font-size: 18px; font-weight: 400; margin-top: 2.5rem;'>Type a location...</h2>`;
  }
});
