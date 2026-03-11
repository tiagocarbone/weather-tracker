"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Navigation, History, Star } from 'lucide-react';
import { useWeather, useForecast } from '@/hooks/useWeather';
import WeatherCard from '@/components/WeatherCard';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const { data: weather, isLoading, error } = useWeather(city, coords);
  const { data: forecast } = useForecast(city, coords);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weather_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setCoords(null);
    setCity(search);
    
    const newHistory = [search, ...history.filter(h => h !== search)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weather_history', JSON.stringify(newHistory));
    setSearch('');
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocalização não suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCity('');
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        showSuccess("Localização obtida com sucesso!");
      },
      () => showError("Não foi possível obter sua localização.")
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-black text-slate-800 tracking-tight"
          >
            Sky<span className="text-blue-500">Buddy</span>
          </motion.h1>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Input 
                placeholder="Buscar cidade..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full pl-10 bg-white border-none shadow-sm focus-visible:ring-blue-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            <Button type="submit" className="rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200">
              Buscar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGeolocation}
              className="rounded-full border-none bg-white shadow-sm hover:bg-slate-50"
            >
              <Navigation size={18} />
            </Button>
          </form>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Display */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="h-96 bg-white/50 animate-pulse rounded-[2rem]" />
            ) : error ? (
              <div className="p-8 bg-red-50 text-red-500 rounded-3xl text-center">
                Cidade não encontrada. Tente novamente!
              </div>
            ) : (
              <WeatherCard data={weather} />
            )}

            {/* Forecast Section */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-slate-700">Próximos Dias</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {forecast?.list?.filter((_: any, i: number) => i % 8 === 0).map((item: any) => (
                  <div key={item.dt} className="flex-shrink-0 flex flex-col items-center p-4 bg-slate-50 rounded-2xl min-w-[100px]">
                    <span className="text-sm font-medium text-slate-500">
                      {new Date(item.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <div className="my-2">
                      <img 
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                        alt="icon"
                        className="w-10 h-10"
                      />
                    </div>
                    <span className="font-bold text-slate-800">{Math.round(item.main.temp)}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: History & Favorites */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <History size={20} />
                <h3 className="font-bold">Histórico</h3>
              </div>
              <div className="space-y-2">
                {history.length === 0 && <p className="text-sm text-slate-400">Nenhuma busca recente.</p>}
                {history.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCity(item)}
                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-slate-50 text-slate-600 text-sm transition-colors capitalize"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Star size={20} fill="white" />
                <h3 className="font-bold">Favoritos</h3>
              </div>
              <p className="text-sm opacity-80 mb-4">Salve suas cidades favoritas para acesso rápido.</p>
              <Button variant="secondary" className="w-full rounded-xl bg-white/20 border-none text-white hover:bg-white/30">
                Adicionar {weather?.name || 'Cidade'}
              </Button>
            </div>
          </aside>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;