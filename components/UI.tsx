import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { ShapeType, ParticleConfig } from '../types';
import { cn } from '../utils/cn';

// --- Constants and Configuration ---

const TEMPLATES: ShapeType[] = [
  ShapeType.HEART,
  ShapeType.FLOWER,
  ShapeType.FIREWORKS,
  ShapeType.TREE,
  ShapeType.RANDOM,
];

const DOCK_CLASSES =
  'absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-2 gap-1 shadow-2xl max-w-[90vw] overflow-x-auto';
const TEMPLATE_BUTTON_CLASSES =
  'relative z-10 h-12 px-6 rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-widest transition-colors duration-300 ease-in-out whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#d70200]';
const CAMERA_TOGGLE_CLASSES =
  'w-16 h-9 rounded-full p-1 transition-colors duration-300 ease-in-out border border-white/20 shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#d70200]';
const CAMERA_KNOB_CLASSES =
  'w-7 h-7 rounded-full shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center';

// --- Sub-components ---

const Logo: React.FC = React.memo(() => (
  <div className="flex items-center select-none pointer-events-none">
    <div className="h-16 w-auto relative text-white drop-shadow-lg">
      <svg viewBox="0 0 160 80" fill="currentColor" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path d="M40 65 A25 25 0 1 1 40 15 A25 25 0 0 1 40 65 M40 25 A15 15 0 1 0 40 55 A15 15 0 0 0 40 25" />
        <path d="M80 65 A25 25 0 1 1 80 15 A25 25 0 0 1 80 65 M80 25 A15 15 0 1 0 80 55 A15 15 0 0 0 80 25" />
        <path d="M110 20 Q 125 10 140 22 H 160 L 158 30 H 140 Q 128 30 120 25 L 110 20" />
        <path d="M122 36 H 155 L 153 44 H 122 V 36" />
        <path d="M120 55 Q 128 50 140 50 H 158 L 160 58 H 140 Q 125 70 110 60 L 120 55" />
      </svg>
    </div>
  </div>
));
Logo.displayName = 'Logo';

// --- Main UI Component ---

interface UIProps {
  config: ParticleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
  cameraEnabled: boolean;
  onToggleCamera: () => void;
  loading: boolean;
}

export const UI: React.FC<UIProps> = ({ config, setConfig, cameraEnabled, onToggleCamera, loading }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const dockRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const measureAndUpdateIndicator = useCallback(() => {
    const activeIndex = Math.max(0, TEMPLATES.indexOf(config.shape));
    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
        opacity: 1,
      });
    }
  }, [config.shape]);

  useLayoutEffect(() => {
    measureAndUpdateIndicator();

    const handleResize = () => requestAnimationFrame(measureAndUpdateIndicator);
    const dockElement = dockRef.current;

    if (!dockElement) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(dockElement);
    window.addEventListener('resize', handleResize);
    document.fonts?.ready.then(handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [measureAndUpdateIndicator]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 text-white overflow-hidden">
      <header className="absolute top-6 left-6">
        <Logo />
      </header>

      <div ref={dockRef} className={DOCK_CLASSES}>
        <div
          className="absolute top-2 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-[left,width,opacity] duration-500 ease-in-out"
          style={indicatorStyle}
        />

        {TEMPLATES.map((t, i) => (
          <button
            key={t}
            ref={el => {
              buttonRefs.current[i] = el;
            }}
            onClick={() => setConfig(prev => ({ ...prev, shape: t }))}
            aria-pressed={config.shape === t}
            className={cn(
              TEMPLATE_BUTTON_CLASSES,
              config.shape === t
                ? 'text-[#d70200]'
                : 'text-white/80 hover:text-white hover:scale-105 active:scale-95'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">Vision</span>
          <button
            onClick={onToggleCamera}
            aria-label={cameraEnabled ? 'Disable camera' : 'Enable camera'}
            className={CAMERA_TOGGLE_CLASSES}
          >
            <div
              className={cn(
                CAMERA_KNOB_CLASSES,
                cameraEnabled ? 'translate-x-7 bg-[#d70200]' : 'translate-x-0 bg-white'
              )}
            >
              {loading && cameraEnabled ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <div
                  className={cn('w-1.5 h-1.5 rounded-full', cameraEnabled ? 'bg-white' : 'bg-[#d70200]')}
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
