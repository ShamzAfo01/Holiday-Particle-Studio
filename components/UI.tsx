
import React, { useState, useEffect, useRef } from 'react';
import { ShapeType, ParticleConfig, HandGestures } from '../types';

interface UIProps {
  config: ParticleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
  hasPermission: boolean;
  handStateRef: React.MutableRefObject<HandGestures>;
  cameraEnabled: boolean;
  onToggleCamera: () => void;
  loading: boolean;
}

const TEMPLATES = [
  ShapeType.HEART,
  ShapeType.FLOWER,
  ShapeType.FIREWORKS,
  ShapeType.TREE,
  ShapeType.RANDOM
];

const Logo: React.FC = () => (
  <div className="flex items-center select-none pointer-events-none">
    {/* Standalone OOBE Vector Logo */}
    <div className="h-16 w-auto relative text-white drop-shadow-2xl">
      <svg viewBox="0 0 160 80" fill="currentColor" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path d="M40 65 A25 25 0 1 1 40 15 A25 25 0 0 1 40 65 M40 25 A15 15 0 1 0 40 55 A15 15 0 0 0 40 25" />
        <path d="M80 65 A25 25 0 1 1 80 15 A25 25 0 0 1 80 65 M80 25 A15 15 0 1 0 80 55 A15 15 0 0 0 80 25" />
        <path d="M110 20 Q 125 10 140 22 H 160 L 158 30 H 140 Q 128 30 120 25 L 110 20" />
        <path d="M122 36 H 155 L 153 44 H 122 V 36" />
        <path d="M120 55 Q 128 50 140 50 H 158 L 160 58 H 140 Q 125 70 110 60 L 120 55" />
      </svg>
    </div>
  </div>
);

export const UI: React.FC<UIProps> = ({ 
  config, 
  setConfig, 
  cameraEnabled,
  onToggleCamera,
  loading
}) => {
  // Calculate position for the sliding background
  const activeIndex = TEMPLATES.indexOf(config.shape);
  
  // Ref for the toggle container to center the active pill
  const toggleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 text-white overflow-hidden">
      
      {/* Top Left Logo */}
      <header className="absolute top-6 left-6">
        <Logo />
      </header>

      {/* Bottom Center: Template Toggles */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div 
            ref={toggleRef}
            className="relative flex items-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-2 gap-2 shadow-2xl"
        >
          {/* Sliding Active Background */}
          {/* We assume fixed width buttons for the sliding effect to work simply, 
              or we could measure refs. For this prompt, fixed dimensions logic is cleaner. 
              The prompt asked for 55-60px height and 24px padding. */}
          <div 
            className="absolute top-2 bottom-2 bg-white rounded-full transition-all duration-700 ease-in-out shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            style={{ 
                left: `${activeIndex * 100 / TEMPLATES.length}%`, 
                width: `${100 / TEMPLATES.length}%`,
                transform: `translateX(${activeIndex === 0 ? '4px' : activeIndex === TEMPLATES.length - 1 ? '-4px' : '0px'})`,
                // Adjust width slightly to account for the padding gap logic if needed, 
                // but percentage based left is safest for responsive.
                // Let's rely on the buttons being flex-1
            }}
          />

          {TEMPLATES.map((t, i) => (
            <button
              key={t}
              onClick={() => setConfig(prev => ({ ...prev, shape: t }))}
              className={`
                relative z-10 h-[50px] px-6 rounded-full flex items-center justify-center
                text-sm font-bold uppercase tracking-widest transition-colors duration-700
                ${config.shape === t ? 'text-[#d70200]' : 'text-white hover:bg-white/10'}
              `}
              style={{ minWidth: '100px' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Right: Camera Toggle */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4 pointer-events-auto">
        
        <div className="flex items-center gap-3">
             <span className="text-xs font-bold uppercase tracking-widest opacity-80 shadow-black drop-shadow-md">
                {cameraEnabled ? "Camera On" : "Camera Off"}
             </span>
             {/* Toggle Switch */}
            <button 
                onClick={onToggleCamera}
                className={`
                    w-16 h-9 rounded-full p-1 transition-colors duration-700 ease-in-out border border-white/20 shadow-xl
                    ${cameraEnabled ? 'bg-white' : 'bg-black/40'}
                `}
            >
                <div 
                    className={`
                        w-7 h-7 rounded-full shadow-md transition-transform duration-700 ease-in-out flex items-center justify-center
                        ${cameraEnabled ? 'translate-x-7 bg-[#d70200]' : 'translate-x-0 bg-white'}
                    `}
                >
                    {loading && cameraEnabled && (
                        <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    )}
                </div>
            </button>
        </div>
        
        {/* The video element in App.tsx will appear here visually due to placement */}
      </div>
    </div>
  );
};
