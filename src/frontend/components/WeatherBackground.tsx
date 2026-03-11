"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface WeatherBackgroundProps {
  code: number;
}

const WeatherBackground = ({ code }: WeatherBackgroundProps) => {
  // Categorias de clima baseadas no WMO
  const isSunny = code === 0;
  const isCloudy = [1, 2, 3].includes(code);
  const isFoggy = [45, 48].includes(code);
  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
  const isSnowy = [71, 73, 75, 85, 86].includes(code);
  const isThunder = [95, 96, 99].includes(code);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Solzinho / Brilho Ensolarado */}
      {isSunny && (
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Nuvenzinhas Flutuantes */}
      {(isCloudy || isFoggy || isRainy || isThunder) && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 blur-2xl rounded-full"
              style={{ 
                width: 120 + i * 40, 
                height: 80 + i * 20, 
                top: `${10 + i * 20}%`, 
                left: '-20%' 
              }}
              animate={{ x: ['0%', '140%'] }}
              transition={{ 
                duration: 20 + i * 5, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2
              }}
            />
          ))}
        </>
      )}

      {/* Chuvinhas (Gotas caindo) */}
      {(isRainy || isThunder) && (
        <>
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-4 bg-blue-200/30 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: -20 }}
              animate={{ y: [0, 400] }}
              transition={{ 
                duration: 0.6 + Math.random() * 0.4, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </>
      )}

      {/* Neve (Flocos) */}
      {isSnowy && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/60 rounded-full blur-[1px]"
              style={{ left: `${Math.random() * 100}%`, top: -10 }}
              animate={{ 
                y: [0, 400],
                x: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </>
      )}

      {/* Raios (Flashes de luz) */}
      {isThunder && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0, 0.5, 0] }}
          transition={{ 
            duration: 0.4, 
            repeat: Infinity, 
            repeatDelay: 4 + Math.random() * 6 
          }}
        />
      )}

      {/* Ventinho (Linhas horizontais rápidas) */}
      {(isFoggy || isCloudy) && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-white/10 rounded-full"
              style={{ 
                width: 80 + Math.random() * 100, 
                top: `${20 + i * 15}%`, 
                left: '-30%' 
              }}
              animate={{ x: ['0%', '160%'] }}
              transition={{ 
                duration: 1.5 + Math.random(), 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 3
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default WeatherBackground;