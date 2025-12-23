
import React, { useState, Suspense, useMemo, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ParticleSystem } from './components/ParticleSystem';
import { UI } from './components/UI';
import { SnowSystem } from './components/SnowSystem';
import { Decorations } from './components/Decorations';
import { SnowFloor } from './components/SnowFloor';
import { GiftModal } from './components/GiftModal';
import { CoachMarks } from './components/CoachMarks';
import { useHandTracking } from './hooks/useHandTracking';
import { ShapeType, ParticleConfig, OnboardingStep } from './types';

const INITIAL_CONFIG: ParticleConfig = {
  count: 50000, 
  color: '#ffd700', 
  shape: ShapeType.HEART,
  autoRotate: true,
};

const DynamicLighting: React.FC = () => {
  const lighting = useMemo(() => {
    const utcHour = new Date().getUTCHours();
    const isNight = utcHour >= 20 || utcHour < 6;
    
    return {
      ambient: isNight ? 0.2 : 0.6,
      point: isNight ? 1.5 : 0.8,
      pointColor: isNight ? '#ffbb66' : '#ffffff',
      spot: isNight ? 2.0 : 1.2,
      fogColor: isNight ? '#550000' : '#d70200'
    };
  }, []);

  return (
    <>
      <ambientLight intensity={lighting.ambient} />
      <pointLight position={[0, 5, 10]} intensity={lighting.point} color={lighting.pointColor} />
      <spotLight position={[10, 20, 10]} angle={0.5} penumbra={1} intensity={lighting.spot} castShadow />
      <fog attach="fog" args={[lighting.fogColor, 15, 60]} />
    </>
  );
};

const App: React.FC = () => {
  const [config, setConfig] = useState<ParticleConfig>(INITIAL_CONFIG);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(OnboardingStep.DONE);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  
  const touchStart = useRef<{x: number, y: number} | null>(null);
  const clickCount = useRef(0);

  const { loading, hasPermission, videoRef, gestureState } = useHandTracking(cameraEnabled);

  const toggleCamera = () => {
    setCameraEnabled(prev => !prev);
  };

  const triggerMagic = useCallback(() => {
    // Only allow coach mark trigger if modal is closed
    if (onboardingStep === OnboardingStep.DONE && !isGiftModalOpen) {
      setOnboardingStep(OnboardingStep.PICK_GIFT);
    }
  }, [onboardingStep, isGiftModalOpen]);

  const handleInteraction = useCallback((e: any) => {
    // Block interference if modal is already open
    if (isGiftModalOpen) return;

    // If coachmark is visible, a click "anywhere" around it dismisses it
    if (onboardingStep === OnboardingStep.PICK_GIFT) {
       // Dismiss if clicking canvas or background root
       if (e.target.tagName === 'CANVAS' || e.target.id === 'root') {
          setOnboardingStep(OnboardingStep.DONE);
       }
    }

    clickCount.current += 1;
    if (clickCount.current >= 2) triggerMagic();

    if (e.type === 'touchstart') {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.type === 'touchend' && touchStart.current) {
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > 50 || Math.abs(dy) > 50) {
        triggerMagic();
      }
      touchStart.current = null;
    }
  }, [triggerMagic, isGiftModalOpen, onboardingStep]);

  useEffect(() => {
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('touchend', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('touchend', handleInteraction);
    };
  }, [handleInteraction]);

  const handleOpenGift = () => {
    setIsGiftModalOpen(true);
    setOnboardingStep(OnboardingStep.DONE);
  };

  return (
    <div className="relative w-full h-screen bg-[#d70200] overflow-hidden">
      <UI 
        config={config} 
        setConfig={setConfig} 
        hasPermission={hasPermission} 
        onToggleCamera={toggleCamera}
        cameraEnabled={cameraEnabled}
        loading={loading}
        handStateRef={gestureState}
      />

      <CoachMarks 
        step={onboardingStep} 
        clickCount={clickCount.current} 
        onClose={() => setOnboardingStep(OnboardingStep.DONE)}
      />
      
      <GiftModal isOpen={isGiftModalOpen} onClose={() => setIsGiftModalOpen(false)} />

      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      
      <div className={`absolute bottom-40 right-12 w-64 h-40 rounded-2xl overflow-hidden border border-white/20 z-10 shadow-2xl bg-black/60 backdrop-blur-xl transition-all duration-1000 ease-in-out origin-bottom ${cameraEnabled ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'}`}>
         {hasPermission && (
             <video 
                ref={(el) => { if(el && videoRef.current?.srcObject) el.srcObject = videoRef.current.srcObject; }}
                className="w-full h-full object-cover transform scale-x-[-1]"
                autoPlay
                muted
             />
         )}
         {!hasPermission && cameraEnabled && (
             <div className="w-full h-full flex items-center justify-center text-white/30 text-[10px] font-black uppercase tracking-widest text-center px-4">
                 {loading ? "WAKING UP..." : "CAMERA ACCESS REQUIRED"}
             </div>
         )}
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 22], fov: 40 }} dpr={[1, 2]} shadows>
          <Suspense fallback={null}>
            <DynamicLighting />
            <group position={[0, 0, 6]}>
              <ParticleSystem count={config.count} shape={config.shape} color={config.color} gestureState={gestureState} autoRotate={config.autoRotate} />
            </group>
            <SnowSystem />
            <Decorations />
            <SnowFloor onOpenGift={handleOpenGift} />
            <OrbitControls enablePan={false} enableZoom={true} maxDistance={40} minDistance={10} maxPolarAngle={Math.PI / 1.8} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;
