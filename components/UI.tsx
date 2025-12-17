
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
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update sliding indicator whenever shape changes
  useEffect(() => {
    const activeIndex = TEMPLATES.indexOf(config.shape);
    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth
      });
    }
  }, [config.shape]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between text-white overflow-hidden">
      <div style={{color: 'white', fontSize: '50px'}}>hello world</div>
      
      {/* Top Left Logo */}
      <header className="absolute top-6 left-6">
        <Logo />
      </header>

      {/* Bottom Center: Template Toggles (Dock) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div 
          className="relative flex items-center bg-transparent h-[68px] px-1 overflow-visible"
        >
          {/* Sliding Active Background - 4px margin from top/bottom implied by h-60 vs parent */}
          <div 
            className="absolute h-[60px] bg-white rounded-full transition-all duration-[700ms] ease-in-out"
            style={{ 
              left: indicatorStyle.left, 
              width: indicatorStyle.width,
              top: '4px'
            }}
          />

          {TEMPLATES.map((t, i) => (
            <button
              key={t}
              ref={el => { buttonRefs.current[i] = el; }}
              onClick={() => setConfig(prev => ({ ...prev, shape: t }))}
              className={`
                relative z-10 h-[60px] px-6 mx-1 rounded-full flex items-center justify-center
                text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-700 ease-in-out whitespace-nowrap
                ${config.shape === t ? 'text-[#d70200]' : 'text-white/80 hover:text-white'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Right: Camera Controller */}
      <div className="absolute bottom-16 right-12 flex flex-col items-end gap-4 pointer-events-auto">
        <div className="flex items-center gap-3 bg-transparent">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Vision
             </span>
             
             {/* Simple Toggle Switch */}
            <button 
                onClick={onToggleCamera}
                className={`
                    w-[64px] h-8 rounded-full p-1 transition-all duration-700 ease-in-out relative border border-white/30
                    ${cameraEnabled ? 'bg-white' : 'bg-black/40'}
                `}
            >
                <div 
                    className={`
                        w-6 h-6 rounded-full shadow-lg transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-center
                        ${cameraEnabled ? 'translate-x-[30px] bg-[#d70200]' : 'translate-x-0 bg-white'}
                    `}
                >
                    {loading && cameraEnabled ? (
                        <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${cameraEnabled ? 'bg-white' : 'bg-[#d70200]'}`} />
                    )}
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};
