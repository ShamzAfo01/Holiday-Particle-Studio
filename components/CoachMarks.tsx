
import React, { useEffect, useState } from 'react';
import { OnboardingStep } from '../types';

interface CoachMarksProps {
  step: OnboardingStep;
  clickCount: number;
  onClose: () => void;
}

export const CoachMarks: React.FC<CoachMarksProps> = ({ step, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (step === OnboardingStep.PICK_GIFT) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [step]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 pointer-events-none z-50 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="relative pointer-events-auto">

        {/* Close Button - Positioned outside and behind the main box */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 hover:text-white hover:bg-white/20 hover:scale-110 transition-all z-0 shadow-lg"
          title="Close"
        >
          <span className="text-[10px] font-black mt-1 ml-1">✕</span>
        </button>

        {/* Main Frosted Box */}
        <div className="group bg-white/5 backdrop-blur-[40px] border border-white/20 px-14 py-10 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col items-center gap-4 text-center min-w-[400px] relative z-10 overflow-hidden">
          {/* Deep frost texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/frozen-wall.png')] pointer-events-none" />

          {/* Realistic static box icon */}
          <div className="text-5xl mb-2 drop-shadow-xl z-10 select-none">
            🎁
          </div>

          <div className="z-10 select-none">
            <h3 className="cursive text-4xl text-white mb-2 whitespace-nowrap drop-shadow-lg">
              Secrets are buried in the snow
            </h3>
            <p className="shimmer-text text-[12px] uppercase tracking-[0.5em] font-black">
              Click a box to reveal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
