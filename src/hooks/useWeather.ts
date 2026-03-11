"use client";

import { useQuery } from '@tanstack/react-query';
import { showError } from '@/utils/toast';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const useWeather = (city: string | null, coords?: { lat: number; lon: number } | null) => {
  return useQuery({
    queryKey: ['weather', city, coords],
    queryFn: async () => {
      if (!API_KEY) {
        showError("API Key do OpenWeather não configurada!");
        throw new Error("Missing API Key");
      }

      let url = `${BASE_URL}/weather?appid=${API_KEY}&units=metric&lang=pt_br`;
      
      if (coords) {
        url += `&lat=${coords.lat}&lon=${coords.lon}`;
      } else if (city) {
        url += `&q=${city}`;
      } else {
        return null;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Cidade não encontrada');
      return response.json();
    },
    enabled: !!city || !!coords,
    staleTime: 1000 * 60 * 15, // Cache de 15 minutos (Simulando estratégia Redis)
  });
};

export const useForecast = (city: string | null, coords?: { lat: number; lon: number } | null) => {
  return useQuery({
    queryKey: ['forecast', city, coords],
    queryFn: async () => {
      if (!API_KEY) return null;
      
      let url = `${BASE_URL}/forecast?appid=${API_KEY}&units=metric&lang=pt_br`;
      
      if (coords) {
        url += `&lat=${coords.lat}&lon=${coords.lon}`;
      } else if (city) {
        url += `&q=${city}`;
      } else {
        return null;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Previsão não encontrada');
      return response.json();
    },
    enabled: !!city || !!coords,
    staleTime: 1000 * 60 * 15,
  });
};