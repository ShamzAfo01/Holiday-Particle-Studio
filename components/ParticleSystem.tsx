
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShapeType, HandGestures } from '../types';
import { generateShapePositions } from '../utils/geometry';

interface ParticleSystemProps {
  count: number;
  shape: ShapeType;
  color: string;
  gestureState: React.MutableRefObject<HandGestures>;
  autoRotate: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count, 
  shape, 
  color, 
  gestureState,
  autoRotate
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Target positions based on shape (Generated once per shape change)
  const targetPositions = useMemo(() => {
    return generateShapePositions(shape, count);
  }, [shape, count]);

  // Current positions of particles (Mutable buffer)
  const currentPositions = useRef<Float32Array>(new Float32Array(count * 3));

  // Initialize current positions on mount
  useEffect(() => {
    // If buffer is empty (all zeros), initialize with target to avoid flying from 0,0,0
    if (currentPositions.current[0] === 0 && currentPositions.current[1] === 0) {
       currentPositions.current.set(targetPositions);
       if (pointsRef.current) {
         pointsRef.current.geometry.attributes.position.needsUpdate = true;
       }
    }
  }, [targetPositions]);

  // Reusable color object
  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    const gestures = gestureState.current;

    // Map Gestures to Interaction Params
    const expansion = gestures.tension; // 0 to 1
    const tension = gestures.closure;   // 0 to 1 (Jitter/Energy)

    // Lerp factors
    const morphSpeed = 4.0 * delta; // Speed of shape transition
    
    const expansionFactor = 1 + expansion * 1.5; // Scale 1x to 2.5x
    const tensionJitter = tension * 0.2; // Jitter amount

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // 1. Get Base Target from the Geometry generator
      const tx = targetPositions[ix];
      const ty = targetPositions[iy];
      const tz = targetPositions[iz];

      // 2. Apply Interaction Modifiers (Scale/Explode)
      let sx = tx, sy = ty, sz = tz;
      
      if (shape === ShapeType.FIREWORKS) {
         // Special logic for fireworks: Pulse outwards constantly
         const explosion = (Math.sin(time * 1.5) + 1) * 0.5 + 0.5; 
         const totalScale = explosion + (expansion * 2.0);
         sx *= totalScale;
         sy *= totalScale;
         sz *= totalScale;
      } else {
         sx *= expansionFactor;
         sy *= expansionFactor;
         sz *= expansionFactor;
      }

      // 3. Apply Tension (Random Noise/Vibration when hands closed)
      if (tension > 0.05) {
         sx += (Math.random() - 0.5) * tensionJitter;
         sy += (Math.random() - 0.5) * tensionJitter;
         sz += (Math.random() - 0.5) * tensionJitter;
      }

      // 4. Update Current Position (Morphing Logic)
      // Smoothly interpolate current position towards modified target
      currentPositions.current[ix] += (sx - currentPositions.current[ix]) * morphSpeed;
      currentPositions.current[iy] += (sy - currentPositions.current[iy]) * morphSpeed;
      currentPositions.current[iz] += (sz - currentPositions.current[iz]) * morphSpeed;

      // 5. Apply "Floating" idle animation (Post-morph)
      const floatX = Math.sin(time * 0.5 + i * 0.1) * 0.05;
      const floatY = Math.cos(time * 0.3 + i * 0.1) * 0.05;

      positions[ix] = currentPositions.current[ix] + floatX;
      positions[iy] = currentPositions.current[iy] + floatY;
      positions[iz] = currentPositions.current[iz];
    }

    // Mark attributes as needing update for Three.js
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Auto-rotate the whole group
    if (autoRotate) {
        pointsRef.current.rotation.y += delta * 0.1 * (1 + expansion);
    } else {
        pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions.current} // Use the mutable buffer
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06} // Slightly reduced size to accommodate 50k density
        color={threeColor}
        transparent
        opacity={1.0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
