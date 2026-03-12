import { Request, Response, NextFunction } from 'express';
import { cached } from '../services/cache';
import { fetchWeatherByCity, fetchWeatherByCoords } from '../services/openWeather';

export async function weatherHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lon, city } = req.query as Record<string, string | undefined>;
    // Open-Meteo does not require an API key
    if ((!lat || !lon) && !city) return res.status(400).json({ error: 'Provide lat/lon or city' });

    // validation is handled by middleware/route guard if used; keep controller focused on fetching

    const key = `weather:${lat || city}:${lon || ''}`;
    const data = await cached(key, async () => {
      if (lat && lon) return fetchWeatherByCoords(lat, lon);
      return fetchWeatherByCity(String(city));
    });
    // If the client provided a city display name, attach it so frontend can show it
    if (city && typeof data === 'object' && data !== null) {
      try {
        (data as Record<string, unknown>).name = String(city);
      } catch (e) {
        // ignore
      }
    }
    return res.json(data);
  } catch (err: unknown) {
    next(err as Error);
  }
}
