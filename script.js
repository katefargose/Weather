const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

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

    // Populate the #weather-result div with clean HTML
    const name = data.name || '';
    const temp = data.main && typeof data.main.temp === 'number' ? Math.round(data.main.temp) : '';
    const description = data.weather && data.weather[0] && data.weather[0].description ? data.weather[0].description : '';
    const humidity = data.main && typeof data.main.humidity !== 'undefined' ? data.main.humidity : '';
    const windSpeed = data.wind && typeof data.wind.speed !== 'undefined' ? data.wind.speed : '';

    weatherResult.innerHTML = `
      <h2>${name} — ${temp}&deg;C</h2>
      <p style="margin:8px 0 0; text-transform:capitalize;">${description}</p>
      <p style="margin:6px 0 0;">Humidity: ${humidity}%</p>
      <p style="margin:6px 0 0;">Wind: ${windSpeed} m/s</p>
    `;
  } catch (err) {
    // Network or other unexpected error
    weatherResult.innerHTML = '';
    errorMessage.innerHTML = 'Something went wrong. Please try again.';
    console.error('Fetch error:', err);
  }
});