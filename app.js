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
<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
`;

async function getLocationCoords(searchParam) {
  const coords = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${searchParam}&units=metric&limit=${1}&appid=${WEATHER_API_KEY}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then(res => {
      if (!res.ok) console.log(`Could not fetch data. Status: ${res.status}`);

      return res.json();
    })
    .catch(err => {
      console.log('Error: ' + err);
    });

  return coords;
  // console.log(coords);
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
      loading = false;
    });

  // console.log(weatherData);
  return weatherData;
}

async function displayData() {
  // Get Coordinates for the queried state
  const coords = await getLocationCoords(searchBox.value);
  const lat = coords[0].lat;
  const lon = coords[0].lon;
  const name = coords[0].name;
  const country = coords[0].country;

  // Get the temperature using geocode
  const data = await getData(lat, lon);

  // Sort data
  const { description, icon } = data.weather[0];
  const { temp, temp_min, temp_max, humidity } = data.main;
  const wind_speed = data.wind.speed;

  if (loading) {
    weatherContainer.innerHTML = loaderAnimation;
  } else {
    weatherContainer.innerHTML = `
    <div class="city-wrapper">
      <h2 class="city">${name}, ${country}</h2>
    </div>
    <div class="main">
      <div class='temp'>
        <i class="fa-solid fa-temperature-three-quarters" style='color: orangered;'></i>
        <span class="temp-field">${temp}º</span>
      </div>
      <div class='weather-state'>
          <img src='http://openweathermap.org/img/w/${icon}.png' class='weather-icon' />
          <span class='weather-state-text'>${description}</span>
        </div>
      <div class='temp-minmax'>
          <div class='temp-min'>Min: ${Math.trunc(temp_min)}º (Fº: ${Math.trunc(
      (temp_min * 9) / 5 + 32
    )})</div>
          <div class='temp-max'>Max: ${Math.trunc(temp_max)}º (Fº: ${Math.trunc(
      (temp_max * 9) / 5 + 32
    )}
    )</div>
        </div>
      <div class="humidity">
        <i class="fa-solid fa-droplet" style='color: aqua;'></i>
        <span class="humid-field">Humidity: ${humidity}</span>
      </div>
      <div class="wind">
        <i class="fa-solid fa-wind" style='color: steelblue;'></i>
        <span class="wind-speed"> Wind Speed: ${wind_speed}km/h </span>
      </div>
    </div>
  `;
  }
  searchBox.value = '';
}

searchBtn.addEventListener('click', async e => {
  e.preventDefault();

  await displayData();
});

document.addEventListener('DOMContentLoaded', () => {
  if (loading) {
    weatherContainer.innerHTML = `
      <h2 class='empty-search' style='font-size: 18px; font-weight: 400;'>Type a location...</h2>
    `;
  }
});
