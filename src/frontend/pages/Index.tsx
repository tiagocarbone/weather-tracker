"use client";

import React, { useState } from 'react';
import Autocomplete from '../components/Autocomplete';
import Button from '../components/Button';
import { Navigation, Cloud } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import WeatherCard from '../components/WeatherCard';
import WeatherIcon from '../components/WeatherIcon';
import { showSuccess, showError } from '../utils/toast';
import { motion } from 'framer-motion';

const Index = () => {
  // Start the app showing Rio de Janeiro by default (will trigger the weather fetch)
  const [city, setCity] = useState('Rio de Janeiro');
  const [coords, setCoords] = useState<{ lat: number; lon: number; display?: string } | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lon: number; display: string } | null>(null);

  const { data: weather, isLoading, error } = useWeather(city, coords);

  

  // history/favorites feature removed

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Only allow searching by a selected suggestion
    if (!selected) {
      showError('Selecione uma cidade das sugestões.');
      return;
    }

    setCoords({ lat: selected.lat, lon: selected.lon });
    setCity('');
    // clear selection input (component manages its own query state)
    setSelected(null);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocalização não suportada.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCity('');
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        showSuccess("Localização obtida!");
      },
      () => showError("Erro ao obter localização.")
    );
  };

  const dailyForecast = weather?.daily?.time?.map((time: string, i: number) => ({
    date: time,
    max: weather.daily.temperature_2m_max[i],
    min: weather.daily.temperature_2m_min[i],
    code: weather.daily.weather_code[i]
  }));
  // show only the next 5 days (skip today)
  const nextFiveDays = dailyForecast?.slice(1, 6);

  return (
    <div className="min-h-screen p-4 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-2xl shadow-blue-900/50">
              <Cloud className="text-white" size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              Weather<span className="text-blue-500">Tracker</span>
            </h1>
          </motion.div>
          
          {/* SEARCH FORM
              Mobile: stacked
              Desktop (md+): 12-column grid where input spans 8 cols and buttons span 4 cols,
              so they visually align with the content columns below.
          */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="relative lg:col-span-8">
              <div className="relative">
                <Autocomplete onSelect={(s) => { setCity(s.display); setCoords({ lat: s.lat, lon: s.lon, display: s.display }); setSelected({ lat: s.lat, lon: s.lon, display: s.display }); }} />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="flex flex-col md:flex-row gap-3 w-full h-full">
                <button
                  type="button"
                  onClick={handleGeolocation}
                  className="w-full md:w-auto rounded-2xl border border-white/10 bg-white/5 h-14 px-8 hover:bg-white/10 flex items-center gap-3 font-semibold text-lg"
                >
                  <Navigation size={20} className="text-blue-400" />
                  <span>Usar meu local</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {isLoading ? (
              <div className="h-[500px] bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5" />
            ) : error ? (
              <div className="p-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[2.5rem] text-center font-medium">
                Cidade não encontrada ou erro na API.
              </div>
            ) : (
              <WeatherCard data={weather} />
            )}

            {/* keep main column focused on the large WeatherCard; side forecast moved to aside */}
          </div>
          <aside className="lg:col-span-4">
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full" />
                Previsão - Próximos 5 dias
              </h3>
              <div className="flex flex-col gap-3">
                {nextFiveDays?.map((item: any) => (
                  <motion.div
                    key={item.date}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 bg-white/3 rounded-lg border border-white/5 hover:bg-white/6 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-blue-200/80">
                          {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <WeatherIcon code={item.code} className="w-8 h-8" />
                      <div className="text-right">
                        <div className="text-sm font-bold">{Math.round(item.max)}°</div>
                        <div className="text-xs text-slate-400">{Math.round(item.min)}°</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </aside>
        </main>
      </div>
      {/* MadeWithDyad component removed */}
    </div>
  );
};

export default Index;