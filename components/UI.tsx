
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

const OobeLogo: React.FC = () => (
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

const Logo: React.FC = () => (
  <div className="flex items-center select-none pointer-events-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
    <div className="h-12 w-auto relative text-white">
      <svg width="79" height="18" viewBox="0 0 79 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 11.7471V1.20898H2.40137V11.7471C2.40137 13.0361 2.72721 13.9886 3.37891 14.6045C4.0306 15.2132 4.89355 15.5176 5.96777 15.5176C7.03483 15.5176 7.89421 15.2132 8.5459 14.6045C9.19759 13.9886 9.52344 13.0361 9.52344 11.7471V1.20898H11.4248V11.7471C11.4248 13.5589 10.902 14.9124 9.85645 15.8076C8.81803 16.7028 7.52181 17.1504 5.96777 17.1504C4.41374 17.1504 3.11393 16.7028 2.06836 15.8076C1.02279 14.9124 0.5 13.5589 0.5 11.7471Z" fill="white" />
        <path d="M14.528 16.8496L18.6637 10.7588L18.8034 10.7373L21.9079 5.81738H23.9811L20.0495 11.7363L19.9206 11.7578L16.6012 16.8496H14.528ZM14.7429 5.81738H16.8591L19.9636 10.7158L20.071 10.7588L24.196 16.8496H22.0798L18.7819 11.7686L18.6852 11.7363L14.7429 5.81738Z" fill="white" />
        <path d="M26.891 9.5127V8.5459C26.891 6.13965 27.4818 4.26693 28.6634 2.92773C29.8451 1.58138 31.392 0.908203 33.3041 0.908203C35.0371 0.908203 36.3871 1.3737 37.3539 2.30469C38.3278 3.22852 38.8614 4.33854 38.9545 5.63477L38.9652 5.7959H37.0531V5.64551C37.0531 4.87207 36.7272 4.16309 36.0755 3.51855C35.4239 2.86686 34.4929 2.54102 33.2826 2.54102C31.9219 2.54102 30.8369 3.07096 30.0277 4.13086C29.2184 5.19076 28.8138 6.66243 28.8138 8.5459V9.5127C28.8138 11.3962 29.222 12.8714 30.0384 13.9385C30.862 14.9984 32.0186 15.5283 33.5082 15.5283C34.2816 15.5283 34.9512 15.446 35.517 15.2812C36.0827 15.1094 36.6162 14.8408 37.1175 14.4756V10.6836H33.2826V9.10449H38.9652V15.1631C38.514 15.6357 37.8229 16.0869 36.892 16.5166C35.961 16.9391 34.833 17.1504 33.5082 17.1504C31.4743 17.1504 29.863 16.4808 28.6742 15.1416C27.4854 13.7952 26.891 11.9189 26.891 9.5127Z" fill="white" />
        <path d="M42.4551 11.5V11.1562C42.4551 9.49479 42.9063 8.1377 43.8086 7.08496C44.711 6.03223 45.9069 5.50586 47.3965 5.50586C48.8861 5.50586 50.0284 5.99642 50.8233 6.97754C51.6254 7.95866 52.0264 9.29069 52.0264 10.9736V11.7256H43.5723V10.2432H50.168V10.0176C50.168 9.20117 49.9388 8.49935 49.4805 7.91211C49.0293 7.32487 48.3562 7.03125 47.461 7.03125C46.4154 7.03125 45.6312 7.42871 45.1084 8.22363C44.5928 9.01139 44.335 9.98893 44.335 11.1562V11.5C44.335 12.6745 44.6071 13.6556 45.1514 14.4434C45.7028 15.2311 46.5443 15.625 47.6758 15.625C48.392 15.625 49.0043 15.471 49.5127 15.1631C50.0212 14.8551 50.433 14.4863 50.7481 14.0566L51.9405 15.0342C51.5967 15.5498 51.0632 16.0332 50.3399 16.4844C49.6237 16.9284 48.7393 17.1504 47.6866 17.1504C46.0036 17.1504 44.711 16.6276 43.8086 15.582C42.9063 14.5293 42.4551 13.1686 42.4551 11.5Z" fill="white" />
        <path d="M55.0114 11.5V11.1562C55.0114 9.49479 55.4626 8.1377 56.365 7.08496C57.2673 6.03223 58.4633 5.50586 59.9529 5.50586C61.4424 5.50586 62.5847 5.99642 63.3796 6.97754C64.1817 7.95866 64.5827 9.29069 64.5827 10.9736V11.7256H56.1286V10.2432H62.7243V10.0176C62.7243 9.20117 62.4952 8.49935 62.0368 7.91211C61.5857 7.32487 60.9125 7.03125 60.0173 7.03125C58.9717 7.03125 58.1876 7.42871 57.6648 8.22363C57.1491 9.01139 56.8913 9.98893 56.8913 11.1562V11.5C56.8913 12.6745 57.1635 13.6556 57.7077 14.4434C58.2592 15.2311 59.1006 15.625 60.2321 15.625C60.9483 15.625 61.5606 15.471 62.0691 15.1631C62.5775 14.8551 62.9893 14.4863 63.3044 14.0566L64.4968 15.0342C64.153 15.5498 63.6195 16.0332 62.8962 16.4844C62.1801 16.9284 61.2956 17.1504 60.2429 17.1504C58.5599 17.1504 57.2673 16.6276 56.365 15.582C55.4626 14.5293 55.0114 13.1686 55.0114 11.5Z" fill="white" />
        <path d="M68.2445 16.8496V0.5H70.0922V10.8877L74.8188 5.81738H76.935L70.0922 13.0791V16.8496H68.2445ZM75.2914 16.8496L70.9731 11.0596L72.1332 9.78125L77.4506 16.8496H75.2914Z" fill="white" />
        <path d="M0.5 11.7471V1.20898H2.40137V11.7471C2.40137 13.0361 2.72721 13.9886 3.37891 14.6045C4.0306 15.2132 4.89355 15.5176 5.96777 15.5176C7.03483 15.5176 7.89421 15.2132 8.5459 14.6045C9.19759 13.9886 9.52344 13.0361 9.52344 11.7471V1.20898H11.4248V11.7471C11.4248 13.5589 10.902 14.9124 9.85645 15.8076C8.81803 16.7028 7.52181 17.1504 5.96777 17.1504C4.41374 17.1504 3.11393 16.7028 2.06836 15.8076C1.02279 14.9124 0.5 13.5589 0.5 11.7471Z" stroke="white" />
        <path d="M14.528 16.8496L18.6637 10.7588L18.8034 10.7373L21.9079 5.81738H23.9811L20.0495 11.7363L19.9206 11.7578L16.6012 16.8496H14.528ZM14.7429 5.81738H16.8591L19.9636 10.7158L20.071 10.7588L24.196 16.8496H22.0798L18.7819 11.7686L18.6852 11.7363L14.7429 5.81738Z" stroke="white" />
        <path d="M26.891 9.5127V8.5459C26.891 6.13965 27.4818 4.26693 28.6634 2.92773C29.8451 1.58138 31.392 0.908203 33.3041 0.908203C35.0371 0.908203 36.3871 1.3737 37.3539 2.30469C38.3278 3.22852 38.8614 4.33854 38.9545 5.63477L38.9652 5.7959H37.0531V5.64551C37.0531 4.87207 36.7272 4.16309 36.0755 3.51855C35.4239 2.86686 34.4929 2.54102 33.2826 2.54102C31.9219 2.54102 30.8369 3.07096 30.0277 4.13086C29.2184 5.19076 28.8138 6.66243 28.8138 8.5459V9.5127C28.8138 11.3962 29.222 12.8714 30.0384 13.9385C30.862 14.9984 32.0186 15.5283 33.5082 15.5283C34.2816 15.5283 34.9512 15.446 35.517 15.2812C36.0827 15.1094 36.6162 14.8408 37.1175 14.4756V10.6836H33.2826V9.10449H38.9652V15.1631C38.514 15.6357 37.8229 16.0869 36.892 16.5166C35.961 16.9391 34.833 17.1504 33.5082 17.1504C31.4743 17.1504 29.863 16.4808 28.6742 15.1416C27.4854 13.7952 26.891 11.9189 26.891 9.5127Z" stroke="white" />
        <path d="M42.4551 11.5V11.1562C42.4551 9.49479 42.9063 8.1377 43.8086 7.08496C44.711 6.03223 45.9069 5.50586 47.3965 5.50586C48.8861 5.50586 50.0284 5.99642 50.8233 6.97754C51.6254 7.95866 52.0264 9.29069 52.0264 10.9736V11.7256H43.5723V10.2432H50.168V10.0176C50.168 9.20117 49.9388 8.49935 49.4805 7.91211C49.0293 7.32487 48.3562 7.03125 47.461 7.03125C46.4154 7.03125 45.6312 7.42871 45.1084 8.22363C44.5928 9.01139 44.335 9.98893 44.335 11.1562V11.5C44.335 12.6745 44.6071 13.6556 45.1514 14.4434C45.7028 15.2311 46.5443 15.625 47.6758 15.625C48.392 15.625 49.0043 15.471 49.5127 15.1631C50.0212 14.8551 50.433 14.4863 50.7481 14.0566L51.9405 15.0342C51.5967 15.5498 51.0632 16.0332 50.3399 16.4844C49.6237 16.9284 48.7393 17.1504 47.6866 17.1504C46.0036 17.1504 44.711 16.6276 43.8086 15.582C42.9063 14.5293 42.4551 13.1686 42.4551 11.5Z" stroke="white" />
        <path d="M55.0114 11.5V11.1562C55.0114 9.49479 55.4626 8.1377 56.365 7.08496C57.2673 6.03223 58.4633 5.50586 59.9529 5.50586C61.4424 5.50586 62.5847 5.99642 63.3796 6.97754C64.1817 7.95866 64.5827 9.29069 64.5827 10.9736V11.7256H56.1286V10.2432H62.7243V10.0176C62.7243 9.20117 62.4952 8.49935 62.0368 7.91211C61.5857 7.32487 60.9125 7.03125 60.0173 7.03125C58.9717 7.03125 58.1876 7.42871 57.6648 8.22363C57.1491 9.01139 56.8913 9.98893 56.8913 11.1562V11.5C56.8913 12.6745 57.1635 13.6556 57.7077 14.4434C58.2592 15.2311 59.1006 15.625 60.2321 15.625C60.9483 15.625 61.5606 15.471 62.0691 15.1631C62.5775 14.8551 62.9893 14.4863 63.3044 14.0566L64.4968 15.0342C64.153 15.5498 63.6195 16.0332 62.8962 16.4844C62.1801 16.9284 61.2956 17.1504 60.2429 17.1504C58.5599 17.1504 57.2673 16.6276 56.365 15.582C55.4626 14.5293 55.0114 13.1686 55.0114 11.5Z" stroke="white" />
        <path d="M68.2445 16.8496V0.5H70.0922V10.8877L74.8188 5.81738H76.935L70.0922 13.0791V16.8496H68.2445ZM75.2914 16.8496L70.9731 11.0596L72.1332 9.78125L77.4506 16.8496H75.2914Z" stroke="white" />
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
        <p className="font-serif italic text-white/60 text-sm">Crafted by UxGeek</p>
        <p className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gold to-white/50">WONDER</p>
      </div>

    </div>
  );
};
