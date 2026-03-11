"use client";

import React from 'react';
import { 
  Sun, Cloud, CloudRain, CloudLightning, 
  CloudSnow, Wind, CloudDrizzle, CloudFog
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  code: number;
  className?: string;
}

const WeatherIcon = ({ code, className = "w-12 h-12" }: WeatherIconProps) => {
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
    if (code === 0) return <Sun {...iconProps} className={`${className} text-yellow-400`} />;
    if ([1, 2, 3].includes(code)) return <Cloud {...iconProps} className={`${className} text-gray-400`} />;
    if ([45, 48].includes(code)) return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    if ([51, 53, 55].includes(code)) return <CloudDrizzle {...iconProps} className={`${className} text-blue-300`} />;
    if ([61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain {...iconProps} className={`${className} text-blue-400`} />;
    if ([71, 73, 75, 85, 86].includes(code)) return <CloudSnow {...iconProps} className={`${className} text-blue-100`} />;
    if ([95, 96, 99].includes(code)) return <CloudLightning {...iconProps} className={`${className} text-purple-500`} />;
    return <Wind {...iconProps} className={`${className} text-teal-400`} />;
  };

  return (
    <motion.div variants={containerVariants} animate="animate">
      {renderIcon()}
    </motion.div>
  );
};

export default WeatherIcon;