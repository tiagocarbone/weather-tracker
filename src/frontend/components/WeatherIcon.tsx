"use client";

import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudLightning, 
  CloudSnow, Wind, CloudDrizzle, Moon 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

const WeatherIcon = ({ condition, className = "w-12 h-12" }: WeatherIconProps) => {
  const iconProps = { className };
  
  const containerVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderIcon = () => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear')) return <Sun {...iconProps} className={`${className} text-yellow-400`} />;
    if (cond.includes('cloud')) return <Cloud {...iconProps} className={`${className} text-gray-400`} />;
    if (cond.includes('rain')) return <CloudRain {...iconProps} className={`${className} text-blue-400`} />;
    if (cond.includes('thunderstorm')) return <CloudLightning {...iconProps} className={`${className} text-purple-500`} />;
    if (cond.includes('snow')) return <CloudSnow {...iconProps} className={`${className} text-blue-100`} />;
    if (cond.includes('drizzle')) return <CloudDrizzle {...iconProps} className={`${className} text-blue-300`} />;
    return <Wind {...iconProps} className={`${className} text-teal-400`} />;
  };

  return (
    <motion.div variants={containerVariants} animate="animate">
      {renderIcon()}
    </motion.div>
  );
};

export default WeatherIcon;