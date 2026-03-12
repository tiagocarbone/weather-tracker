import { Request, Response, NextFunction } from 'express';
import { findInSuggests } from '../services/cache';

export function validateSuggestion(req: Request, res: Response, next: NextFunction) {
  const { lat, lon, city } = req.query as Record<string, string | undefined>;
  if (lat && lon) {
    const allow = findInSuggests((it) => {
      if (typeof it !== 'object' || it === null) return false;
      const rec = it as Record<string, unknown>;
      const l = typeof rec.lat === 'number' ? rec.lat : Number(rec.lat as unknown as string);
      const lo = typeof rec.lon === 'number' ? rec.lon : Number(rec.lon as unknown as string);
      return Math.abs(l - Number(lat)) < 0.0001 && Math.abs(lo - Number(lon)) < 0.0001;
    });
    if (!allow) return res.status(400).json({ error: 'Location not allowed - must come from recent suggestions' });
  } else if (city) {
    const lower = String(city).toLowerCase();
    const allow = findInSuggests((it) => {
      if (typeof it !== 'object' || it === null) return false;
      const rec = it as Record<string, unknown>;
      const name = typeof rec.name === 'string' ? rec.name : String(rec.name ?? '');
      return name.toLowerCase() === lower;
    });
    if (!allow) return res.status(400).json({ error: 'City not allowed - must come from recent suggestions' });
  }
  next();
}
