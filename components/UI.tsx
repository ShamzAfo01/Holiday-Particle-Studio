
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
      <svg width="68" height="18" viewBox="0 0 68 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M36.4915 3.13047L35.7359 3.78541L35.7359 3.78541L36.4915 3.13047ZM36.4915 13.8695L35.7359 13.2146L35.7359 13.2146L36.4915 13.8695ZM13.8534 14.0299L14.5694 13.3318L14.5694 13.3318L13.8534 14.0299ZM14.2323 2.1861L13.6226 1.39347L14.2323 2.1861ZM1 15.5H0V16.5H1V15.5ZM51.627 4.44046L52.459 3.88576L52.459 3.88576L51.627 4.44046ZM52 9.5H53V8.5H52V9.5ZM58.9452 14.6562L59.5699 13.8753L59.5699 13.8753L58.9452 14.6562ZM58.59 3.19206L59.3582 3.83224L59.3582 3.83224L58.59 3.19206ZM51.8824 15.0882L52.4824 15.8882L52.4824 15.8882L51.8824 15.0882ZM44 16L43.4855 16.8575L43.4855 16.8575L44 16ZM43.09 3.69206L43.8582 4.33224L43.8582 4.33224L43.09 3.69206ZM65.91 3.19206L66.6783 2.55187L66.6783 2.55187L65.91 3.19206ZM12.0001 6.71952H11.0001V9.47424H12.0001H13.0001V6.71952H12.0001ZM18.5258 16V17H31.8258V16V15H18.5258V16ZM38 9.82582H39V7.17417H38H37V9.82582H38ZM31.8258 1V0H17.7196V1V2H31.8258V1ZM36.4915 3.13047L37.2472 2.47554C35.8846 0.903258 33.9064 0 31.8258 0V1V2C33.3264 2 34.7531 2.65145 35.7359 3.78541L36.4915 3.13047ZM38 7.17417H39C39 5.4481 38.3777 3.7799 37.2472 2.47554L36.4915 3.13047L35.7359 3.78541C36.5512 4.72615 37 5.92929 37 7.17417H38ZM36.4915 13.8695L37.2472 14.5245C38.3777 13.2201 39 11.5519 39 9.82582H38H37C37 11.0707 36.5512 12.2739 35.7359 13.2146L36.4915 13.8695ZM31.8258 16V17C33.9064 17 35.8846 16.0967 37.2472 14.5245L36.4915 13.8695L35.7359 13.2146C34.7531 14.3486 33.3264 15 31.8258 15V16ZM13.8534 14.0299L13.1374 14.728C14.5538 16.1807 16.4968 17 18.5258 17V16V15C17.0361 15 15.6094 14.3985 14.5694 13.3318L13.8534 14.0299ZM12.0001 9.47424H11.0001C11.0001 11.4372 11.767 13.3225 13.1374 14.728L13.8534 14.0299L14.5694 13.3318C13.5632 12.2998 13.0001 10.9155 13.0001 9.47424H12.0001ZM14.2323 2.1861L13.6226 1.39347C11.9691 2.66545 11.0001 4.63332 11.0001 6.71952H12.0001H13.0001C13.0001 5.25426 13.6806 3.87211 14.842 2.97872L14.2323 2.1861ZM14.2323 2.1861L14.842 2.97872C15.6671 2.34409 16.6787 2 17.7196 2V1V0C16.2376 0 14.7973 0.489908 13.6226 1.39347L14.2323 2.1861ZM1 1H0V15.5H1H2V1H1ZM1 15.5V16.5H9.5V15.5V14.5H1V15.5ZM52 5L52.8321 4.4453L52.459 3.88576L51.627 4.44046L50.7949 4.99516L51.1679 5.5547L52 5ZM47.0669 2V1H46.7026V2V3H47.0669V2ZM42 6.70256H41V12.3539H42H43V6.70256H42ZM46 16.5V17.5H47.6471V16.5V15.5H46V16.5ZM52 14.8529H53V9.5H52H51V14.8529H52ZM52 9.5V8.5H47.5V9.5V10.5H52V9.5ZM62.2026 1.5V2.5H62.2974V1.5V0.5H62.2026V1.5ZM67 6.20256H66V11.2322H67H68V6.20256H67ZM62.7322 15.5V14.5H61.3508V15.5V16.5H62.7322V15.5ZM57.5 11.6492H58.5V6.20256H57.5H56.5V11.6492H57.5ZM58.9452 14.6562L59.5699 13.8753C58.8937 13.3343 58.5 12.5152 58.5 11.6492H57.5H56.5C56.5 13.1228 57.1698 14.5165 58.3205 15.437L58.9452 14.6562ZM61.3508 15.5V14.5C60.7035 14.5 60.0754 14.2797 59.5699 13.8753L58.9452 14.6562L58.3205 15.437C59.1806 16.1251 60.2493 16.5 61.3508 16.5V15.5ZM65.75 14.25L65.0429 13.5429C64.4301 14.1557 63.5989 14.5 62.7322 14.5V15.5V16.5C64.1293 16.5 65.4692 15.945 66.4571 14.9571L65.75 14.25ZM67 11.2322H66C66 12.0989 65.6557 12.9301 65.0429 13.5429L65.75 14.25L66.4571 14.9571C67.445 13.9692 68 12.6293 68 11.2322H67ZM58.59 3.19206L59.3582 3.83224C60.0616 2.98808 61.1037 2.5 62.2026 2.5V1.5V0.5C60.5102 0.5 58.9052 1.25173 57.8217 2.55187L58.59 3.19206ZM58.59 3.19206L57.8217 2.55187C56.9677 3.57671 56.5 4.86853 56.5 6.20256H57.5H58.5C58.5 5.3364 58.8037 4.49765 59.3582 3.83224L58.59 3.19206ZM51.8824 15.0882L52.4824 15.8882C52.8082 15.6438 53 15.2603 53 14.8529H52H51C51 14.6308 51.1046 14.4215 51.2823 14.2882L51.8824 15.0882ZM47.6471 16.5V17.5C49.3907 17.5 51.0874 16.9344 52.4824 15.8882L51.8824 15.0882L51.2824 14.2882C50.2336 15.0748 48.958 15.5 47.6471 15.5V16.5ZM44 16L43.4855 16.8575C44.2179 17.2969 45.2446 17.5 46 17.5V16.5V15.5C45.502 15.5 44.8569 15.3479 44.5145 15.1425L44 16ZM42 12.3539H41C41 13.1852 41.3141 14.1075 41.7305 14.875C42.1449 15.6387 42.7518 16.4173 43.4855 16.8575L44 16L44.5145 15.1425C44.2067 14.9578 43.8137 14.5207 43.4884 13.9212C43.1652 13.3255 43 12.7372 43 12.3539H42ZM43.09 3.69206L42.3217 3.05187C41.4677 4.07671 41 5.36853 41 6.70256H42H43C43 5.8364 43.3037 4.99765 43.8582 4.33224L43.09 3.69206ZM65.91 3.19206L65.1418 3.83224C65.6963 4.49765 66 5.3364 66 6.20256H67H68C68 4.86852 67.5323 3.57671 66.6783 2.55187L65.91 3.19206ZM46.7026 2V1C45.0102 1 43.4052 1.75173 42.3217 3.05187L43.09 3.69206L43.8582 4.33224C44.5616 3.48808 45.6037 3 46.7026 3V2ZM62.2974 1.5V2.5C63.3963 2.5 64.4384 2.98808 65.1418 3.83224L65.91 3.19206L66.6783 2.55187C65.5948 1.25173 63.9898 0.5 62.2974 0.5V1.5ZM51.627 4.44046L52.459 3.88576C51.2571 2.0829 49.2337 1 47.0669 1V2V3C48.565 3 49.9639 3.7487 50.7949 4.99516L51.627 4.44046Z" fill="white" />
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
