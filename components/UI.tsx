
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
  { type: ShapeType.HEART, label: 'Love' },
  { type: ShapeType.FLOWER, label: 'Bloom' },
  { type: ShapeType.FIREWORKS, label: 'Spark' },
  { type: ShapeType.TREE, label: 'Tree' },
  { type: ShapeType.RANDOM, label: 'Snow' }
];

const Logo: React.FC = () => (
  <div className="flex items-center select-none pointer-events-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
    <div className="h-12 w-auto relative text-white">
      <svg width="60" height="33" viewBox="0 0 51 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 28H22L25.5 25H30.6972C31.8727 25 33.0219 24.6521 34 24H45.5L47.5 20H38.5V17H43.5L46 12.5H37L35 9.5H48.5L51 5.5H35V5.12132C35 3.76306 34.4604 2.46043 33.5 1.5C32.5396 0.539566 31.2369 0 29.8787 0H22L25 4H27.9393C28.6185 4 29.2698 4.26978 29.75 4.75C30.2302 5.23022 30.5 5.88153 30.5 6.56066V7.34861C30.5 7.77335 30.3743 8.18858 30.1387 8.54199C29.7397 9.1405 29.0679 9.5 28.3486 9.5H25L26.5 13.5H30.5C31.4443 13.5 32.3334 13.9446 32.9 14.7C33.2895 15.2193 33.5 15.8509 33.5 16.5V17.1324C33.5 18.3282 33.025 19.475 32.1794 20.3206C31.4183 21.0817 30.4101 21.5454 29.337 21.6279L24.5 22L17 28Z" fill="currentColor" />
        <path d="M18 14.5C18 19.4706 13.9706 23.5 9 23.5C4.02944 23.5 0 19.4706 0 14.5C0 9.52944 4.02944 5.5 9 5.5C13.9706 5.5 18 9.52944 18 14.5ZM3.53376 14.5C3.53376 17.5189 5.98108 19.9662 9 19.9662C12.0189 19.9662 14.4662 17.5189 14.4662 14.5C14.4662 11.4811 12.0189 9.03376 9 9.03376C5.98108 9.03376 3.53376 11.4811 3.53376 14.5Z" fill="currentColor" />
        <path d="M27 14.5C27 19.4706 22.9706 23.5 18 23.5C13.0294 23.5 9 19.4706 9 14.5C9 9.52944 13.0294 5.5 18 5.5C22.9706 5.5 27 9.52944 27 14.5ZM12.5338 14.5C12.5338 17.5189 14.9811 19.9662 18 19.9662C21.0189 19.9662 23.4662 17.5189 23.4662 14.5C23.4662 11.4811 21.0189 9.03376 18 9.03376C14.9811 9.03376 12.5338 11.4811 12.5338 14.5Z" fill="currentColor" />
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

  useEffect(() => {
    const activeIndex = TEMPLATES.findIndex(t => t.type === config.shape);
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

      {/* Top Left Logo & Title */}
      <header className="absolute top-8 left-8 flex items-center gap-4 animate-fade-in-down">
        <Logo />
        {/* <div className="opacity-90">
          <h1 className="text-xl font-bold tracking-widest uppercase font-serif text-white drop-shadow-md">Holiday</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-light">Particle Studio</p>
        </div> */}
      </header>

      {/* Main Controls Container - Bottom Center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto w-full max-w-4xl px-6 flex flex-col items-center gap-6">

        {/* Glassmorphism Control Bar */}
        <div className="relative flex items-center gap-2 p-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-500 hover:bg-black/40 hover:border-white/20 hover:scale-[1.01]">

          {/* Sliding Indicator */}
          <div
            className="absolute h-[calc(100%-16px)] top-2 bg-gradient-to-r from-[#d70200] to-[#b30000] rounded-full shadow-[0_0_20px_rgba(215,2,0,0.4)] transition-all duration-500 cubic-bezier(0.2, 0, 0.2, 1)"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width
            }}
          />

          {TEMPLATES.map((t, i) => (
            <button
              key={t.type}
              ref={el => { buttonRefs.current[i] = el; }}
              onClick={() => setConfig(prev => ({ ...prev, shape: t.type }))}
              className={`
                relative z-10 px-6 py-3 rounded-full flex items-center justify-center gap-2
                transition-all duration-300 group
              `}
            >
              <span className={`
                text-xs font-bold uppercase tracking-widest transition-colors duration-300
                ${config.shape === t.type ? 'text-white' : 'text-white/50 group-hover:text-white'}
              `}>
                {t.label}
              </span>
            </button>
          ))}

          <div className="w-px h-8 bg-white/10 mx-2" />

          {/* Camera Toggle */}
          <button
            onClick={onToggleCamera}
            className={`
                    relative px-4 py-2 mr-1 rounded-full flex items-center gap-3 transition-all duration-500
                    ${cameraEnabled ? 'bg-white/10 ring-1 ring-[#d70200]' : 'hover:bg-white/5'}
                `}
          >
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Magic Mode</span>
              <span className={`text-[10px] font-bold tracking-wider transition-colors duration-300 ${cameraEnabled ? 'text-[#d70200]' : 'text-white/80'}`}>
                {cameraEnabled ? 'ACTIVE' : 'OFF'}
              </span>
            </div>

            <div
              className={`
                        w-10 h-6 rounded-full p-1 transition-colors duration-500 relative
                        ${cameraEnabled ? 'bg-[#d70200]' : 'bg-white/20'}
                    `}
            >
              <div
                className={`
                            w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                            ${cameraEnabled ? 'translate-x-[16px]' : 'translate-x-0'}
                            flex items-center justify-center
                        `}
              >
                {loading && cameraEnabled && (
                  <div className="w-2 h-2 border-[1.5px] border-[#d70200] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Decorative Corner Text */}
      <div className="absolute bottom-10 right-10 text-right pointer-events-none opacity-50 hidden md:block">
        <p className="font-serif italic text-white/60 text-sm">Crafted with</p>
        <p className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gold to-white/50">WONDER</p>
      </div>

    </div>
  );
};
