"use client";

import React from 'react';
import WeatherIcon from './WeatherIcon';
import WeatherBackground from './WeatherBackground';
import WeatherIcon from './WeatherIcon';
import WeatherBackground from './WeatherBackground';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, MapPin } from 'lucide-react';

interface WeatherCardProps {
  data: any;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  if (!data) return null;

  const getBgGradient = (code: number) => {
    if (code === 0) return 'from-blue-500 to-indigo-700';
    if ([1, 2, 3].includes(code)) return 'from-slate-600 to-slate-800';
    if ([61, 63, 65, 80, 81, 82].includes(code)) return 'from-blue-800 to-blue-950';
    if ([95, 96, 99].includes(code)) return 'from-indigo-900 to-purple-950';
    return 'from-blue-900 to-slate-900';
  };

  const code = data.weather[0].code;
  const bgGradient = getBgGradient(code);

  const nameParts = (data.name || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const titleName = nameParts.length > 0 ? nameParts[0] : data.name;
  const locationSubtitle = nameParts.length > 1 ? nameParts.slice(1).join(', ') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`relative overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br ${bgGradient} text-white rounded-[2rem]`}>
        <WeatherBackground code={code} />

        <div className="p-8 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-blue-400" />
                <h2 className="text-3xl font-bold tracking-tight">{titleName}</h2>
              </div>
              {locationSubtitle && (
                <p className="text-sm text-blue-100/70 font-medium mb-1">{locationSubtitle}</p>
              )}
              <p className="text-lg capitalize text-blue-200/80 font-medium">{data.weather[0].description}</p>
            </div>
            <WeatherIcon code={code} className="w-20 h-20 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
          </div>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              {Math.round(data.main.temp)}°
            </span>
            <div className="mb-4">
              <p className="text-xl font-medium text-blue-100/60">Sensação {Math.round(data.main.feels_like)}°</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 bg-black/30 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Droplets size={20} className="text-blue-400" />
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-widest text-blue-200/50 font-bold mb-0.5">Umidade</span>
                <span className="text-lg font-bold">{data.main.humidity}%</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 border-x border-white/10">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Wind size={20} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-widest text-blue-200/50 font-bold mb-0.5">Vento</span>
                <span className="text-lg font-bold">{Math.round(data.wind.speed * 3.6)} <small className="text-[9px]">km/h</small></span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-cyan-500/20 rounded-xl">
                <Thermometer size={20} className="text-cyan-400" />
              </div>
              <div className="text-center">
                <span className="block text-[10px] uppercase tracking-widest text-blue-200/50 font-bold mb-0.5">Pressão</span>
                <span className="text-lg font-bold">{Math.round(data.main.pressure)} <small className="text-[9px]">hPa</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;