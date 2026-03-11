"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import WeatherIcon from './WeatherIcon';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, MapPin } from 'lucide-react';

interface WeatherCardProps {
  data: any;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  if (!data) return null;

  // Paleta de azuis profundos baseada na condição
  const themeColors: Record<string, string> = {
    Clear: 'from-blue-600 to-indigo-900',
    Clouds: 'from-slate-700 to-slate-900',
    Rain: 'from-blue-800 to-blue-950',
    Thunderstorm: 'from-indigo-900 to-purple-950',
    Snow: 'from-blue-900 to-slate-800',
    Drizzle: 'from-cyan-900 to-blue-950',
  };

  const condition = data.weather[0].main;
  const bgGradient = themeColors[condition] || 'from-blue-900 to-slate-900';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className={`overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br ${bgGradient} text-white rounded-[2.5rem]`}>
        <CardContent className="p-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-blue-400" />
                <h2 className="text-4xl font-bold tracking-tight">{data.name}</h2>
              </div>
              <p className="text-xl capitalize text-blue-200/80 font-medium">{data.weather[0].description}</p>
            </div>
            <WeatherIcon condition={condition} className="w-28 h-28 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          </div>

          <div className="mt-12 flex items-baseline gap-4">
            <span className="text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              {Math.round(data.main.temp)}°
            </span>
            <div className="mb-6">
              <p className="text-2xl font-medium text-blue-100/60">Sensação {Math.round(data.main.feels_like)}°</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 bg-black/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Droplets size={24} className="text-blue-400" />
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase tracking-widest text-blue-200/50 font-bold mb-1">Umidade</span>
                <span className="text-xl font-bold">{data.main.humidity}%</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 border-x border-white/10">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <Wind size={24} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase tracking-widest text-blue-200/50 font-bold mb-1">Vento</span>
                <span className="text-xl font-bold">{Math.round(data.wind.speed * 3.6)} <small className="text-[10px]">km/h</small></span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-cyan-500/20 rounded-2xl">
                <Thermometer size={24} className="text-cyan-400" />
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase tracking-widest text-blue-200/50 font-bold mb-1">Pressão</span>
                <span className="text-xl font-bold">{data.main.pressure} <small className="text-[10px]">hPa</small></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;