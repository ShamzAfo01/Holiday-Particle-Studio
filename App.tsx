
import React, { useState, Suspense } from 'react';
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
  count: 20000, 
  color: '#ffd700', 
  shape: ShapeType.HEART,
  autoRotate: true,
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
      {/* UI Layer */}
      <UI 
        config={config} 
        setConfig={setConfig} 
        hasPermission={hasPermission} 
        onToggleCamera={toggleCamera}
        cameraEnabled={cameraEnabled}
        loading={loading}
        handStateRef={gestureState}
      />

      {/* Hidden Processing Video */}
      <video 
        ref={videoRef} 
        className="hidden" 
        autoPlay 
        playsInline 
        muted 
      />
      
      {/* Camera Feedback: Positioned below the toggle UI */}
      <div 
        className={`
            absolute bottom-32 right-12 w-56 h-36 rounded-2xl overflow-hidden border border-white/20 z-10 shadow-2xl bg-black/40 backdrop-blur-md
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
                 {loading ? "INITIALIZING..." : "ACCESS DENIED"}
             </div>
         )}
      </div>

      {/* 3D Scene */}
      <Canvas 
        className="absolute inset-0 z-0" 
        camera={{ position: [0, 2, 18], fov: 40 }} 
        dpr={[1, 2]} 
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 15, 10]} angle={0.4} penumbra={1} intensity={2.0} castShadow />
          <pointLight position={[-10, 5, -10]} intensity={1.0} color="#ffaa00" />
          
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

          <fog attach="fog" args={['#d70200', 10, 50]} />

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            maxDistance={30}
            minDistance={5}
            maxPolarAngle={Math.PI / 2} 
            autoRotate={false}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.1}
          />
          
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
