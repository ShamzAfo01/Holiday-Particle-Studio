
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
  count: 50000, // Increased density
  color: '#ffd700', // Gold for contrast against red background
  shape: ShapeType.HEART,
  autoRotate: true,
};

const App: React.FC = () => {
  const [config, setConfig] = useState<ParticleConfig>(INITIAL_CONFIG);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  
  const { loading, hasPermission, videoRef, gestureState } = useHandTracking(cameraEnabled);

  return (
    <div className="relative w-full h-screen bg-[#d70200]">
      {/* UI Layer */}
      <UI 
        config={config} 
        setConfig={setConfig} 
        hasPermission={hasPermission} 
        onToggleCamera={() => setCameraEnabled(true)}
        loading={loading}
        handStateRef={gestureState}
      />

      {/* Hidden Video Element for MediaPipe */}
      <video 
        ref={videoRef} 
        className="hidden absolute bottom-0 right-0 w-32 h-24 object-cover opacity-50 z-50 pointer-events-none" 
        autoPlay 
        playsInline 
        muted 
      />
      
      {/* Debug view */}
      {hasPermission && (
          <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-white/20 z-10 shadow-lg">
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
             <div className="absolute bottom-0 w-full bg-black/50 text-[8px] text-white text-center">Camera Active</div>
          </div>
      )}

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 18], fov: 40 }} dpr={[1, 2]} shadows>
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 15, 10]} angle={0.4} penumbra={1} intensity={2.0} castShadow />
            <pointLight position={[-10, 5, -10]} intensity={1.0} color="#ffaa00" />
            
            {/* Particles (Main Object) - Brought Forward */}
            <group position={[0, 0, 6]}>
              <ParticleSystem 
                count={config.count} 
                shape={config.shape} 
                color={config.color} 
                gestureState={gestureState}
                autoRotate={config.autoRotate}
              />
            </group>

            {/* 3D Snow Falling */}
            <SnowSystem />

            {/* Hanging Decorations (Balls & Star) */}
            <Decorations />

            {/* Snow Floor & Text */}
            <SnowFloor />

            {/* Environment Fog */}
            <fog attach="fog" args={['#d70200', 10, 50]} />

            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              maxDistance={30}
              minDistance={5}
              maxPolarAngle={Math.PI / 2} 
              autoRotate={false}
            />
            
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;
