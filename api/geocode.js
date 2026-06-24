export default async function handler(req, res) {
  try {
    const q = req.query.q;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!q) {
      return res.status(400).json({ error: 'Missing required query parameter: q' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: missing API key' });
    }

    const endpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${encodeURIComponent(apiKey)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenWeatherMap error: ${errText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Serverless function error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
