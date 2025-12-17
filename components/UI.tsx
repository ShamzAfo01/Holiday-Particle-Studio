import React, { useState, useEffect } from 'react';
import { ShapeType, ParticleConfig, DAILY_LORE, HandGestures } from '../types';

interface UIProps {
  config: ParticleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
  hasPermission: boolean;
  handStateRef: React.MutableRefObject<HandGestures>;
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

const COLORS = [
  '#ffffff', // Snow
  '#ffd700', // Gold
  '#00ff00', // Green
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ff9900', // Orange
];

export const UI: React.FC<UIProps> = ({ 
  config, 
  setConfig, 
  hasPermission, 
  onToggleCamera,
  loading,
  handStateRef
}) => {
  const [loreShape, setLoreShape] = useState<ShapeType | null>(null);
  const [loreDate, setLoreDate] = useState<string>('');
  const [debugStr, setDebugStr] = useState('');
  
  // Daily Lore Check
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const key = `${month}-${day}`;
    if (DAILY_LORE[key]) {
      setLoreShape(DAILY_LORE[key]);
      setLoreDate(`Dec ${day}`);
    } else {
       setLoreShape(ShapeType.TREE); 
       setLoreDate("Holiday Mode");
    }
  }, []);

  // Debug Loop for gesture stats
  useEffect(() => {
    const interval = setInterval(() => {
        const s = handStateRef.current;
        if (s.detected) {
            setDebugStr(`Tension: ${s.tension.toFixed(2)} | Close: ${s.closure.toFixed(2)}`);
        } else {
            setDebugStr(hasPermission ? "Looking for hands..." : "Mouse Control Mode");
        }
    }, 200);
    return () => clearInterval(interval);
  }, [hasPermission]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 text-white overflow-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md font-serif">
            Holiday Particle Studio
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {loreDate}
            </span>
            {loreShape && (
              <button 
                onClick={() => setConfig(prev => ({ ...prev, shape: loreShape }))}
                className="bg-green-700/80 hover:bg-green-600 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold transition-all border border-green-400 shadow-lg"
              >
                Apply Lore: {loreShape}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
            {!hasPermission && (
                <button 
                    onClick={onToggleCamera}
                    className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-colors pointer-events-auto"
                >
                    {loading ? "Loading AI..." : "Enable Hand Control"}
                </button>
            )}
             <div className="text-xs font-mono opacity-60 bg-black/20 p-1 rounded">
                {debugStr}
            </div>
        </div>
      </header>

      {/* Main Controls - Bottom Left */}
      <div className="pointer-events-auto w-full md:w-80 bg-black/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl mt-auto">
        
        {/* Shape Grid */}
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-widest opacity-70 mb-2 font-bold">Templates</h3>
          <div className="grid grid-cols-4 gap-2">
            {TEMPLATES.map(t => (
              <button
                key={t}
                onClick={() => setConfig(prev => ({ ...prev, shape: t }))}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold text-center p-1 transition-all
                  ${config.shape === t 
                    ? 'bg-white text-red-700 shadow-lg scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-white'}
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders & Toggles */}
        <div className="space-y-4">
            
            {/* Color Picker (Simple) */}
            <div>
                 <h3 className="text-xs uppercase tracking-widest opacity-70 mb-2 font-bold">Theme Color</h3>
                 <div className="flex gap-2">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => setConfig(prev => ({...prev, color: c}))}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 ${config.color === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        />
                    ))}
                    <input 
                        type="color" 
                        value={config.color}
                        onChange={(e) => setConfig(prev => ({...prev, color: e.target.value}))}
                        className="w-6 h-6 rounded-full overflow-hidden border-0 p-0"
                    />
                 </div>
            </div>

            {/* Mouse Fallback Controls (Only if no camera or hands not detected) */}
            <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xs uppercase tracking-widest opacity-70 font-bold">
                       {hasPermission ? "Gesture Simulation" : "Manual Control"}
                   </h3>
                   <button 
                     onClick={() => setConfig(prev => ({...prev, autoRotate: !prev.autoRotate}))}
                     className={`text-[10px] px-2 py-0.5 rounded border ${config.autoRotate ? 'bg-white text-red-900' : 'border-white/30'}`}
                   >
                       Auto Rotate
                   </button>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] w-12">Expand</span>
                        <input 
                            type="range" min="0" max="1" step="0.01"
                            className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                            onChange={(e) => {
                                handStateRef.current.tension = parseFloat(e.target.value);
                                // If using manual slider, force detection flag so it doesn't decay
                                if (!hasPermission) handStateRef.current.detected = true;
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] w-12">Focus</span>
                        <input 
                            type="range" min="0" max="1" step="0.01"
                            className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                            onChange={(e) => {
                                handStateRef.current.closure = parseFloat(e.target.value);
                                if (!hasPermission) handStateRef.current.detected = true;
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};