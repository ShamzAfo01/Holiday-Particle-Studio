
import React, { useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ParticleSystem } from './components/ParticleSystem';
import { UI } from './components/UI';
import { SnowSystem } from './components/SnowSystem';
import { Decorations } from './components/Decorations';
import { SnowFloor } from './components/SnowFloor';
import { useHandTracking } from './hooks/useHandTracking';
import { ShapeType, ParticleConfig } from './types';

const INITIAL_CONFIG: ParticleConfig = {
  count: 50000, 
  color: '#ffd700', 
  shape: ShapeType.HEART,
  autoRotate: true,
};

const DynamicLighting: React.FC = () => {
  const lighting = useMemo(() => {
    const utcHour = new Date().getUTCHours();
    // Simplified day/night cycle: Night between 20:00 and 06:00
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
  
  const { loading, hasPermission, videoRef, gestureState } = useHandTracking(cameraEnabled);

  const toggleCamera = () => {
    setCameraEnabled(prev => !prev);
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

      <video 
        ref={videoRef} 
        className="hidden" 
        autoPlay 
        playsInline 
        muted 
      />
      
      {/* Camera Feedback */}
      <div 
        className={`
            absolute bottom-40 right-12 w-64 h-40 rounded-2xl overflow-hidden border border-white/20 z-10 shadow-2xl bg-black/60 backdrop-blur-xl
            transition-all duration-1000 ease-in-out origin-bottom
            ${cameraEnabled ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 pointer-events-none'}
        `}
      >
         {hasPermission && (
             <video 
                ref={(el) => {
                    if(el && videoRef.current && videoRef.current.srcObject) {
                        el.srcObject = videoRef.current.srcObject;
                    }
                }}
                className="w-full h-full object-cover transform scale-x-[-1]"
                autoPlay
                muted
             />
         )}
         {!hasPermission && cameraEnabled && (
             <div className="w-full h-full flex items-center justify-center text-white/30 text-[10px] font-black uppercase tracking-widest">
                 {loading ? "WAKING UP..." : "CAMERA ACCESS REQUIRED"}
             </div>
         )}
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 22], fov: 40 }} dpr={[1, 2]} shadows>
          <Suspense fallback={null}>
            <DynamicLighting />
            
            <group position={[0, 0, 6]}>
              <ParticleSystem 
                count={config.count} 
                shape={config.shape} 
                color={config.color} 
                gestureState={gestureState}
                autoRotate={config.autoRotate}
              />
            </group>

            <SnowSystem />
            <Decorations />
            <SnowFloor />

            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              maxDistance={40}
              minDistance={10}
              maxPolarAngle={Math.PI / 1.8} 
              autoRotate={false}
            />
            
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;
