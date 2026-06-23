const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

// Helper: map OpenWeatherMap "main" condition keywords to emojis
function mapConditionToEmoji(main) {
  if (!main) return '🌡️';
  const key = main.toLowerCase();
  switch (key) {
    case 'rain':
      return '🌧️';
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'snow':
      return '❄️';
    case 'thunderstorm':
      return '⛈️';
    case 'mist':
    case 'fog':
    case 'haze':
      return '🌫️';
    case 'drizzle':
      return '🌦️';
    default:
      return '🌡️';
  }
}

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
  const url = `${endpoint}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // API returned an error (e.g. 404 city not found)
      weatherResult.innerHTML = '';
      errorMessage.innerHTML = 'City not found. Please check the spelling and try again.';
      console.log('OpenWeatherMap error response status:', response.status);
      return;
    }

    const data = await response.json();
    console.log('OpenWeatherMap response:', data);

    // Clear any previous error message on success
    errorMessage.innerHTML = '';

    // Populate the #weather-result div with structured HTML and classes for styling
    const name = data.name || '';
    const temp = data.main && typeof data.main.temp === 'number' ? Math.round(data.main.temp) : '';
    const mainCond = data.weather && data.weather[0] && data.weather[0].main ? data.weather[0].main : '';
    const description = data.weather && data.weather[0] && data.weather[0].description ? data.weather[0].description : '';
    const humidity = data.main && typeof data.main.humidity !== 'undefined' ? data.main.humidity : '';
    const windSpeed = data.wind && typeof data.wind.speed !== 'undefined' ? data.wind.speed : '';

    const emoji = mapConditionToEmoji(mainCond);
    const conditionText = `${emoji} ${description}`;

    weatherResult.innerHTML = `
      <div class="weather-card-inner">
        <div class="weather-main">
          <h2 class="weather-city">${name} — <span class="weather-temp">${temp}&deg;C</span></h2>
        </div>
        <div class="weather-condition">${conditionText}</div>
        <div class="weather-details">
          <span class="weather-humidity">Humidity: 💧 ${humidity}%</span>
          <span class="weather-wind">Wind: 💨 ${windSpeed} m/s</span>
        </div>
      </div>
    `;
  } catch (err) {
    // Network or other unexpected error
    weatherResult.innerHTML = '';
    errorMessage.innerHTML = 'Something went wrong. Please try again.';
    console.error('Fetch error:', err);
  }
});