import { Request, Response, NextFunction } from 'express';
import { cached } from '../services/cache';
import { fetchForecastByCity, fetchForecastByCoords } from '../services/openWeather';

export async function forecastHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lon, city } = req.query as Record<string, string | undefined>;
    // Open-Meteo does not require an API key
    if ((!lat || !lon) && !city) return res.status(400).json({ error: 'Provide lat/lon or city' });

    const key = `forecast:${lat || city}:${lon || ''}`;
    const data = await cached(key, async () => {
      if (lat && lon) return fetchForecastByCoords(lat, lon);
      return fetchForecastByCity(String(city));
    });
    return res.json(data);
  } catch (err: unknown) {
    next(err as Error);
  }
}
