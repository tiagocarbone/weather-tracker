// Use the global fetch provided by Node.js (v18+). We declare it so TypeScript
// doesn't complain when compiling without DOM libs.
// Use the global fetch provided by Node.js (v18+). Declare so TypeScript is happy.
declare function fetch(input: unknown, init?: unknown): Promise<any>;
import { Suggest } from '../types';

// We replace the OpenWeather service with Open-Meteo (no API key required).
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

function getWmoDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Principalmente limpo', 2: 'Parcialmente nublado', 3: 'Encoberto',
    45: 'Nevoeiro', 48: 'Nevoeiro com geada',
    51: 'Chuvisco leve', 53: 'Chuvisco moderado', 55: 'Chuvisco denso',
    61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
    71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte',
    80: 'Pancadas de chuva leves', 81: 'Pancadas de chuva moderadas', 82: 'Pancadas de chuva violentas',
    95: 'Trovoada', 96: 'Trovoada com granizo leve', 99: 'Trovoada com granizo forte'
  };
  return descriptions[code] || 'Desconhecido';
}

export async function geocode(q: string, limit = 5): Promise<Suggest[]> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=${limit}&language=pt&format=json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Geocoding failed');
  const json = await r.json();
  const results = json.results ?? [];
  return (results as unknown[]).map((item: unknown) => {
    const it = item as Record<string, unknown>;
    const name = typeof it.name === 'string' ? it.name : String(it.name ?? '');
    const lat = typeof it.latitude === 'number' ? it.latitude : Number(it.latitude as unknown as string);
    const lon = typeof it.longitude === 'number' ? it.longitude : Number(it.longitude as unknown as string);
    const country = typeof it.country === 'string' ? it.country : String(it.country ?? '');
    const state = typeof it.admin1 === 'string' ? it.admin1 : undefined;
    return {
      name,
      lat,
      lon,
      country,
      state,
      display: `${name}${state ? ', ' + state : ''}, ${country}`,
    };
  });
}

async function fetchRawWeather(lat: number | string, lon: number | string) {
  const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,pressure_msl,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Open-Meteo error');
  return r.json();
}

export async function fetchWeatherByCoords(lat: number | string, lon: number | string) {
  const data = await fetchRawWeather(lat, lon);
  // Normalize to match frontend expectation (similar to the client hook normalization)
  const current = data.current_weather ?? {};
  const hourly = data.hourly ?? {};
  const code = (hourly.weathercode && hourly.weathercode.length && hourly.weathercode[0]) || current.weathercode || 0;
  const temperature = ((hourly.temperature_2m && hourly.temperature_2m.length && hourly.temperature_2m[0]) || current.temperature) ?? null;
  const apparent = ((hourly.apparent_temperature && hourly.apparent_temperature.length && hourly.apparent_temperature[0]) || null) ?? null;
  const humidity = ((hourly.relativehumidity_2m && hourly.relativehumidity_2m.length && hourly.relativehumidity_2m[0]) || null) ?? null;
  const pressure = ((hourly.pressure_msl && hourly.pressure_msl.length && hourly.pressure_msl[0]) || null) ?? null;
  const wind = (((hourly.windspeed_10m && hourly.windspeed_10m.length && hourly.windspeed_10m[0]) || current.windspeed) || null) ?? null;

  return {
    ...data,
    name: undefined,
    main: {
      temp: temperature,
      feels_like: apparent,
      humidity,
      pressure,
    },
    wind: {
      // keep same convention as frontend: value in m/s
      speed: wind == null ? null : (wind / 3.6),
    },
    weather: [
      {
        code,
        description: getWmoDescription(code),
      },
    ],
  };
}

export async function fetchWeatherByCity(city: string) {
  const geos = await geocode(city, 1);
  if (!geos || geos.length === 0) throw new Error('City not found');
  const g = geos[0];
  const data = await fetchWeatherByCoords(g.lat, g.lon);
  // attach name
  return { ...data, name: g.display || g.name };
}

export async function fetchForecastByCoords(lat: number | string, lon: number | string) {
  // reuse fetchRawWeather which already includes daily
  const data = await fetchRawWeather(lat, lon);
  return data;
}

export async function fetchForecastByCity(city: string) {
  const geos = await geocode(city, 1);
  if (!geos || geos.length === 0) throw new Error('City not found');
  const g = geos[0];
  const data = await fetchForecastByCoords(g.lat, g.lon);
  return { ...data, name: g.display || g.name };
}
