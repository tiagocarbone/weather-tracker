"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Navigation, History, Star, Cloud } from 'lucide-react';
import { useWeather, useForecast } from '@/hooks/useWeather';
import WeatherCard from '@/components/WeatherCard';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen p-4 md:p-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/50">
              <Cloud className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">
              Sky<span className="text-blue-500">Buddy</span>
            </h1>
          </motion.div>
          
          <form onSubmit={handleSearch} className="flex flex-wrap w-full md:w-auto gap-3">
            <div className="relative flex-1 min-w-[200px] md:w-80">
              <Input 
                placeholder="Buscar cidade..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 focus-visible:ring-blue-500 focus-visible:bg-white/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            </div>
            <Button type="submit" className="rounded-2xl bg-blue-600 hover:bg-blue-500 h-12 px-8 font-bold shadow-lg shadow-blue-900/40">
              Buscar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGeolocation}
              className="rounded-2xl border-white/10 bg-white/5 h-12 px-6 hover:bg-white/10 flex items-center gap-2 font-semibold"
            >
              <Navigation size={18} className="text-blue-400" />
              <span className="hidden sm:inline">Usar meu local</span>
              <span className="sm:hidden">Local</span>
            </Button>
          </form>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {isLoading ? (
              <div className="h-[500px] bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5" />
            ) : error ? (
              <div className="p-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[2.5rem] text-center font-medium">
                Cidade não encontrada. Verifique o nome e tente novamente.
              </div>
            ) : (
              <WeatherCard data={weather} />
            )}

            {/* Forecast */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                Previsão Semanal
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {forecast?.list?.filter((_: any, i: number) => i % 8 === 0).map((item: any) => (
                  <motion.div 
                    key={item.dt}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm font-bold text-blue-200/50 uppercase tracking-wider mb-3">
                      {new Date(item.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
                      alt="weather"
                      className="w-16 h-16 drop-shadow-md"
                    />
                    <span className="text-2xl font-black mt-2">{Math.round(item.main.temp)}°</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <History size={22} className="text-blue-400" />
                <h3 className="text-xl font-bold">Recentes</h3>
              </div>
              <div className="space-y-3">
                {history.length === 0 && <p className="text-slate-500 text-sm italic">Nenhuma busca recente.</p>}
                {history.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCity(item)}
                    className="w-full text-left px-5 py-4 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 text-slate-300 font-medium transition-all capitalize flex justify-between items-center group"
                  >
                    {item}
                    <Search size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  <h3 className="text-xl font-bold">Favoritos</h3>
                </div>
                <p className="text-blue-100/70 text-sm leading-relaxed mb-6">
                  Mantenha suas cidades mais importantes sempre à mão.
                </p>
                <Button variant="secondary" className="w-full rounded-2xl bg-white/10 border-none text-white hover:bg-white/20 h-12 font-bold backdrop-blur-md">
                  Salvar {weather?.name || 'Cidade'}
                </Button>
              </div>
            </div>
          </aside>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;