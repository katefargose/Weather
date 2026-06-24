# Weather App

A simple, responsive weather app with city autocomplete, built with HTML, CSS, and vanilla JavaScript. Deployed on Vercel with serverless functions to keep the OpenWeatherMap API key secure.

## Features

- Search current weather by city name
- Live city autocomplete (debounced, de-duplicated suggestions)
- Emoji-based weather condition indicators
- Error handling for invalid cities and network failures
- Mobile responsive design

## Live Demo

[weather-kate03.vercel.app](https://weather-kate03.vercel.app)

## Tech Stack

- HTML, CSS, vanilla JavaScript (frontend)
- Vercel Serverless Functions (`/api/weather`, `/api/geocode`) to proxy OpenWeatherMap requests securely
- [OpenWeatherMap API](https://openweathermap.org/api) — current weather + geocoding

## Running Locally

This project uses a `config.js` file (excluded from git via `.gitignore`) to store the OpenWeatherMap API key for local development.

1. Clone the repo
2. Create a `config.js` file in the project root with the following content:
```js
   const API_KEY = "your_openweathermap_api_key_here";
```
3. Get a free API key from [openweathermap.org](https://openweathermap.org/api)
4. Open `index.html` with a local server (e.g. VSCode Live Server extension)

**Note:** In production (Vercel), the API key is instead stored as an environment variable (`OPENWEATHER_API_KEY`) and used securely server-side via the serverless functions in `/api`, never exposed to the browser.

## Deployment

Deployed on Vercel. The `/api/weather.js` and `/api/geocode.js` serverless functions read the API key from a Vercel environment variable and proxy requests to OpenWeatherMap, so the key is never exposed in client-side code.