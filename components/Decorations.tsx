
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROPE_MATERIAL = new THREE.MeshStandardMaterial({ color: '#888888', roughness: 0.8 });
const GOLD_MATERIAL = new THREE.MeshStandardMaterial({ 
  color: '#FFD700', 
  metalness: 1.0, 
  roughness: 0.15,
  emissive: '#FFD700',
  emissiveIntensity: 0.1
});
const CAP_MATERIAL = new THREE.MeshStandardMaterial({ color: '#C0C0C0', metalness: 0.9, roughness: 0.2 });

const HangingOrnament: React.FC<{ position: [number, number, number], type: 'ball' | 'star', delay: number }> = ({ position, type, delay }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle sway
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 1.5 + delay) * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 1.0 + delay) * 0.02;
    }
  });

  const stringHeight = 15 - position[1]; // Anchor to some point high up

  return (
    <group position={position}>
      {/* Pivot point wrapper for swaying */}
      <group ref={groupRef} position={[0, stringHeight, 0]}>
        {/* Move geometry down so pivot is at top */}
        <group position={[0, -stringHeight, 0]}>
            {/* String */}
            <mesh position={[0, stringHeight/2, 0]} material={ROPE_MATERIAL}>
                <cylinderGeometry args={[0.01, 0.01, stringHeight, 8]} />
            </mesh>
            
            {/* Ornament Cap */}
            <mesh position={[0, 0.6, 0]} material={CAP_MATERIAL}>
                <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
            </mesh>
            <mesh position={[0, 0.8, 0]} rotation={[0,0,Math.PI/2]} material={CAP_MATERIAL}>
                 <torusGeometry args={[0.1, 0.02, 8, 16]} />
            </mesh>

            {type === 'ball' ? (
                <mesh material={GOLD_MATERIAL}>
                    <sphereGeometry args={[0.7, 64, 64]} />
                </mesh>
            ) : (
                <group scale={0.8}>
                    {/* Simple Star Shape */}
                     <mesh material={GOLD_MATERIAL} rotation={[0, 0, 0]}>
                        <cylinderGeometry args={[0, 1, 0.4, 5]} />
                     </mesh>
                     <mesh material={GOLD_MATERIAL} rotation={[0, 0, Math.PI]} position={[0, -0.2, 0]}>
                        <cylinderGeometry args={[0, 1, 0.4, 5]} />
                     </mesh>
                     {/* Inner light */}
                     <pointLight distance={3} intensity={2} color="#ffaa00" />
                </group>
            )}
        </group>
      </group>
    </group>
  );
};

export const Decorations: React.FC = () => {
  return (
    <group>
      {/* Far Left */}
      <HangingOrnament position={[-8, 5, -2]} type="ball" delay={0.5} />
      {/* Mid Left */}
      <HangingOrnament position={[-5, 7, -2]} type="ball" delay={0} />
      {/* Near Left */}
      <HangingOrnament position={[-2.5, 6, -2]} type="ball" delay={1.5} />
      
      {/* Center Star - Highest */}
      <HangingOrnament position={[0, 8, -2]} type="star" delay={1} />

      {/* Near Right */}
      <HangingOrnament position={[2.5, 6, -2]} type="ball" delay={2} />
      {/* Mid Right */}
      <HangingOrnament position={[5, 7, -2]} type="ball" delay={2.5} />
      {/* Far Right */}
      <HangingOrnament position={[8, 5, -2]} type="ball" delay={3} />
    </group>
  );
};
