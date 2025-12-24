
import React, { useState, useEffect, useRef } from 'react';
import { GIFT_LORE } from '../types';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalPhase = 'FLYING' | 'CARD';

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<ModalPhase>('FLYING');
  const [isFlipped, setIsFlipped] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPhase('FLYING');
      setIsFlipped(false);
      const timer = setTimeout(() => setPhase('CARD'), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const today = new Date();
  const dateKey = `${today.getMonth() + 1}-${today.getDate()}`;
  const lore = GIFT_LORE[dateKey] || GIFT_LORE['12-25'];

  // Generating coordinates for 8 small stars around the card's center/button area
  const stars = [
    { top: '35%', left: '20%', delay: '0s', duration: '3s' },
    { top: '45%', left: '75%', delay: '0.5s', duration: '3.5s' },
    { top: '65%', left: '15%', delay: '1s', duration: '4s' },
    { top: '75%', left: '80%', delay: '1.5s', duration: '3.2s' },
    { top: '85%', left: '30%', delay: '0.2s', duration: '3.8s' },
    { top: '88%', left: '70%', delay: '0.8s', duration: '3.3s' },
    { top: '40%', left: '45%', delay: '1.2s', duration: '4.5s' },
    { top: '25%', left: '60%', delay: '0.4s', duration: '3.1s' },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-[5px] overflow-hidden"
      onClick={handleBackdropClick}
    >

      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[#FFD700]/10 transition-opacity duration-1000 ${phase === 'CARD' ? 'opacity-20' : 'opacity-0'}`} />
      </div>

      <div className="relative w-full max-w-[400px] aspect-[4/5.5] flex items-center justify-center perspective-1000">

        <div className={`
          relative w-full h-full transition-all duration-700 transform-style-3d
          ${phase === 'CARD' ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-40'}
        `}>
          <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

            {/* FRONT OF CARD */}
            <div className="absolute inset-0 bg-[#d70200] border-[2px] border-[#FFD700] rounded-2xl shadow-[0_50px_120px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between backface-hidden p-12 overflow-hidden">
              {/* Paper Texture */}
              <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]" />

              <div className="w-full text-center mt-4 relative z-10">
                <span className="text-[#FFD700] text-[10px] uppercase tracking-[0.7em] font-black opacity-80">Merry Christmas</span>
                <h2 className="cursive text-5xl text-white mt-4 drop-shadow-lg">A Gift For You</h2>
              </div>

              {/* Small Stars Background around the card's middle to bottom area */}
              {stars.map((s, i) => (
                <div
                  key={i}
                  className="absolute animate-star-float text-xl select-none"
                  style={{
                    top: s.top,
                    left: s.left,
                    animationDelay: s.delay,
                    '--star-duration': s.duration
                  } as any}
                >
                  ✨
                </div>
              ))}

              <div className="relative z-10 w-full flex justify-center mb-4">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-4/5 py-4 bg-[#FFD700] text-[#d70200] text-[12px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all rounded-full shadow-[0_10px_30px_rgba(255,215,0,0.3)]"
                >
                  Look Inside
                </button>
              </div>
            </div>

            {/* INSIDE OF CARD */}
            <div className="absolute inset-0 bg-[#fefefe] border-[2px] border-[#165B33] rounded-2xl shadow-[0_50px_120px_rgba(0,0,0,0.8)] flex flex-col items-center rotate-y-180 backface-hidden p-12 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

              {/* Corner Decorations */}
              <div className="absolute top-4 left-4 text-[#165B33]/20 text-2xl select-none">❄</div>
              <div className="absolute top-4 right-4 text-[#165B33]/20 text-2xl select-none">❄</div>
              <div className="absolute bottom-4 left-4 text-[#165B33]/20 text-2xl select-none">❄</div>
              <div className="absolute bottom-4 right-4 text-[#165B33]/20 text-2xl select-none">❄</div>

              <div className="mt-8 mb-4 relative z-10">
                <span className="text-[#165B33]/40 font-black text-[10px] uppercase tracking-[0.5em] block mb-2">Day {lore.day}</span>
                <h3 className="cursive text-4xl text-[#D42426] leading-tight mb-4 drop-shadow-sm">{lore.title}</h3>
                <div className="flex items-center justify-center gap-2 opacity-30">
                  <div className="h-[1px] w-8 bg-[#D42426]" />
                  <div className="w-1 h-1 rounded-full bg-[#D42426]" />
                  <div className="h-[1px] w-8 bg-[#D42426]" />
                </div>
              </div>

              <div className="text-7xl mb-8 opacity-90 filter drop-shadow-md transform hover:scale-110 transition-transform duration-500 cursor-default">
                {lore.emoji}
              </div>

              <p className="text-slate-600 leading-relaxed italic max-w-xs mb-10 text-sm px-4 font-medium relative z-10">
                "{lore.description}"
              </p>

              <button
                onClick={() => setIsFlipped(false)}
                className="mt-auto mb-4 text-[#165B33]/50 font-black text-[9px] uppercase tracking-widest hover:text-[#165B33] transition-colors"
              >
                Return to Cover
              </button>

              <div className="pb-4 w-full border-t border-slate-100 pt-6 relative z-10">
                <p className=" text-[#165B33] text-2xl">Happy Holidays</p>
                <p className="font-black tracking-[0.2em] text-[9px] text-slate-300 mt-1">From UxGeek</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
