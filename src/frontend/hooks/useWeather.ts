"use client";

import { useQuery } from '@tanstack/react-query';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const useWeather = (city: string | null, coords?: { lat: number; lon: number } | null) => {
  return useQuery({
    queryKey: ['weather-data', city, coords],
    queryFn: async () => {
      let lat = coords?.lat;
      let lon = coords?.lon;
      // start with explicit city string if provided
      let cityName = city || undefined;

      // If caller passed a display string along with coords (e.g. from Autocomplete), prefer it
      if ((coords as any)?.display) {
        cityName = (coords as any).display;
      }

      // Geocoding: transforma nome da cidade em coordenadas (only if we don't already have lat/lon)
      if ((lat === undefined || lon === undefined) && city) {
        const geoRes = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('Cidade não encontrada');
        }

        const g = geoData.results[0];
        lat = g.latitude;
        lon = g.longitude;
        const parts: string[] = [g.name];
        if (g.admin1) parts.push(g.admin1);
        if (g.country) parts.push(g.country);
        cityName = parts.join(', ');


      }

      if (lat === undefined || lon === undefined) return null;

      // Busca clima atual e previsão diária
      const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao buscar clima');

      const data = await response.json();

      // Normalização dos dados para os componentes
      return {
        ...data,
        name: cityName,
        main: {
          temp: data.current.temperature_2m,
          feels_like: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          pressure: data.current.pressure_msl
        },
        wind: {
          speed: data.current.wind_speed_10m / 3.6
        },
        weather: [{
          code: data.current.weather_code,
          description: getWmoDescription(data.current.weather_code)
        }]
      };
    },
    enabled: !!city || !!coords,
    staleTime: 1000 * 60 * 15,
  });
};

export const getWmoDescription = (code: number): string => {
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
};