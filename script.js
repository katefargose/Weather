const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');
const suggestionsList = document.getElementById('suggestions-list');

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

// Fetch city suggestions from OpenWeatherMap Geocoding API
async function fetchCitySuggestions(query) {
  if (!query || query.trim().length < 2) return;

  const endpoint = 'https://api.openweathermap.org/geo/1.0/direct';
  const url = `${endpoint}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    console.log('Geocoding suggestions:', json);
    return json;
  } catch (err) {
    console.error('Error fetching city suggestions:', err);
    return;
  }
}

// Generic debounce helper: delays calling func until delay ms have passed since the last call
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    const context = this;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(context, args);
    }, delay);
  };
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

// Live suggestions: debounce input and fetch suggestions
if (suggestionsList) {
  cityInput.addEventListener('input', debounce(async () => {
    const query = cityInput.value.trim();

    if (!query || query.length < 2) {
      suggestionsList.innerHTML = '';
      suggestionsList.style.display = 'none';
      return;
    }

    const results = await fetchCitySuggestions(query) || [];

    // Clear existing items
    suggestionsList.innerHTML = '';

    if (!results.length) {
      suggestionsList.style.display = 'none';
      return;
    }

    // Populate list
    for (const item of results) {
      const name = item.name || '';
      const country = item.country || '';
      const state = item.state ? `, ${item.state}` : '';
      const li = document.createElement('li');
      li.textContent = `${name}${state}${country ? ', ' + country : ''}`;

      // When a suggestion is clicked: set the input, hide suggestions, and trigger the search
      li.addEventListener('click', () => {
        cityInput.value = name;
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        // Trigger the existing search button handler
        if (typeof searchBtn.click === 'function') {
          searchBtn.click();
        }
      });

      suggestionsList.appendChild(li);
    }

    suggestionsList.style.display = 'block';
  }, 400));
}

// Enter key handling on the city input: trigger the existing search when Enter is pressed
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (suggestionsList) {
      suggestionsList.innerHTML = '';
      suggestionsList.style.display = 'none';
    }
    if (typeof searchBtn.click === 'function') {
      searchBtn.click();
    }
  }
});