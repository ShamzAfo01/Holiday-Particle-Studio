
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
    <div className="h-10 w-auto relative text-[#111111]">
      <svg width="51" height="28" viewBox="0 0 51 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 28H22L25.5 25H30.6972C31.8727 25 33.0219 24.6521 34 24H45.5L47.5 20H38.5V17H43.5L46 12.5H37L35 9.5H48.5L51 5.5H35V5.12132C35 3.76306 34.4604 2.46043 33.5 1.5C32.5396 0.539566 31.2369 0 29.8787 0H22L25 4H27.9393C28.6185 4 29.2698 4.26978 29.75 4.75C30.2302 5.23022 30.5 5.88153 30.5 6.56066V7.34861C30.5 7.77335 30.3743 8.18858 30.1387 8.54199C29.7397 9.1405 29.0679 9.5 28.3486 9.5H25L26.5 13.5H30.5C31.4443 13.5 32.3334 13.9446 32.9 14.7C33.2895 15.2193 33.5 15.8509 33.5 16.5V17.1324C33.5 18.3282 33.025 19.475 32.1794 20.3206C31.4183 21.0817 30.4101 21.5454 29.337 21.6279L24.5 22L17 28Z" fill="currentColor"/>
        <path d="M18 14.5C18 19.4706 13.9706 23.5 9 23.5C4.02944 23.5 0 19.4706 0 14.5C0 9.52944 4.02944 5.5 9 5.5C13.9706 5.5 18 9.52944 18 14.5ZM3.53376 14.5C3.53376 17.5189 5.98108 19.9662 9 19.9662C12.0189 19.9662 14.4662 17.5189 14.4662 14.5C14.4662 11.4811 12.0189 9.03376 9 9.03376C5.98108 9.03376 3.53376 11.4811 3.53376 14.5Z" fill="currentColor"/>
        <path d="M27 14.5C27 19.4706 22.9706 23.5 18 23.5C13.0294 23.5 9 19.4706 9 14.5C9 9.52944 13.0294 5.5 18 5.5C22.9706 5.5 27 9.52944 27 14.5ZM12.5338 14.5C12.5338 17.5189 14.9811 19.9662 18 19.9662C21.0189 19.9662 23.4662 17.5189 23.4662 14.5C23.4662 11.4811 21.0189 9.03376 18 9.03376C14.9811 9.03376 12.5338 11.4811 12.5338 14.5Z" fill="currentColor"/>
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
      
      {/* Top Left Logo */}
      <header className="absolute top-8 left-8">
        <Logo />
      </header>

      {/* Bottom Center: Template Toggles */}
      <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="relative flex items-center bg-transparent h-[68px] px-1">
          {/* Sliding Indicator with 4px vertical offset */}
          <div 
            className="absolute h-[60px] bg-white rounded-full transition-all duration-700 ease-in-out"
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
                relative z-10 h-[60px] px-8 mx-1 rounded-full flex items-center justify-center
                text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-700 ease-in-out whitespace-nowrap
                ${config.shape === t ? 'text-[#d70200]' : 'text-white/60 hover:text-white'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Right: Vision Post Toggle */}
      <div className="absolute bottom-[28px] right-12 flex items-center gap-6 pointer-events-auto">
        <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                Vision Post
             </span>
             
            <button 
                onClick={onToggleCamera}
                className="w-[72px] h-9 rounded-full p-1 transition-all duration-500 bg-black/80 border border-white/10 relative"
            >
                <div 
                    className={`
                        w-7 h-7 rounded-full transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center
                        ${cameraEnabled ? 'translate-x-[36px] bg-[#d70200]' : 'translate-x-0 bg-white/20'}
                    `}
                >
                    {loading && cameraEnabled ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className={`w-2 h-2 rounded-full ${cameraEnabled ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/40'}`} />
                    )}
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};
