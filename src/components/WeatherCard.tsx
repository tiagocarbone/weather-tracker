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

  const themeColors: Record<string, string> = {
    Clear: 'from-orange-400 to-yellow-200',
    Clouds: 'from-blue-400 to-gray-200',
    Rain: 'from-blue-600 to-blue-300',
    Thunderstorm: 'from-purple-700 to-blue-900',
    Snow: 'from-blue-100 to-white',
    Drizzle: 'from-teal-400 to-blue-200',
  };

  const condition = data.weather[0].main;
  const bgGradient = themeColors[condition] || 'from-blue-400 to-blue-200';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden border-none shadow-2xl bg-gradient-to-br ${bgGradient} text-white rounded-[2rem]`}>
        <CardContent className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="opacity-80" />
                <h2 className="text-3xl font-bold">{data.name}</h2>
              </div>
              <p className="text-lg capitalize opacity-90">{data.weather[0].description}</p>
            </div>
            <WeatherIcon condition={condition} className="w-24 h-24" />
          </div>

          <div className="mt-8 flex items-end gap-4">
            <span className="text-8xl font-black tracking-tighter">
              {Math.round(data.main.temp)}°
            </span>
            <div className="mb-4">
              <p className="text-xl font-medium">Sente como {Math.round(data.main.feels_like)}°</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 bg-white/20 backdrop-blur-md rounded-3xl p-6">
            <div className="flex flex-col items-center gap-2">
              <Thermometer size={20} />
              <span className="text-sm opacity-80">Umidade</span>
              <span className="font-bold">{data.main.humidity}%</span>
            </div>
            <div className="flex flex-col items-center gap-2 border-x border-white/20">
              <Wind size={20} />
              <span className="text-sm opacity-80">Vento</span>
              <span className="font-bold">{Math.round(data.wind.speed * 3.6)} km/h</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Droplets size={20} />
              <span className="text-sm opacity-80">Pressão</span>
              <span className="font-bold">{data.main.pressure} hPa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;