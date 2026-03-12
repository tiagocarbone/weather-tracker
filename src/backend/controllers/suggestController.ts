import { Request, Response, NextFunction } from 'express';
import { cached } from '../services/cache';
import { geocode } from '../services/openWeather';
import { Suggest } from '../types';

export async function suggestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const q = String(req.query.q || '');
    const limit = parseInt(String(req.query.limit || '5'), 10);
    if (!q) return res.status(400).json({ error: 'q is required' });
    // Open-Meteo does not require an API key

    const key = `suggest:${q}:${limit}`;
    const results: Suggest[] = await cached(key, async () => geocode(q, limit));
    return res.json(results);
  } catch (err: unknown) {
    next(err as Error);
  }
}
