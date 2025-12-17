
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SNOW_COUNT = 1200; // Reduced for subtle effect
const SPAWN_RANGE_Y = 20;
const SPAWN_RANGE_X = 25;
const SPAWN_RANGE_Z = 15;

const VERTEX_SHADER = `
  uniform float uTime;
  attribute float size;
  attribute float speed;
  varying float vOpacity;
  
  void main() {
    vec3 pos = position;
    
    // Fall animation
    float fallOffset = uTime * speed;
    
    // Wrap logic: Modulo within range
    float top = 12.0;
    float bottom = -5.0; // Slightly below floor
    float height = top - bottom;
    
    // Calculate current y based on loop
    float y = top - mod(pos.y + fallOffset, height);
    
    // Sway logic
    float swayX = sin(uTime * 0.5 + pos.y) * 0.5;
    float swayZ = cos(uTime * 0.3 + pos.x) * 0.5;
    
    pos.x += swayX;
    pos.z += swayZ;
    pos.y = y;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation (smaller particles)
    gl_PointSize = size * (150.0 / length(mvPosition.xyz));
    
    // Melt logic: Fade out as we approach ground (-4.0 is approx floor)
    float distToFloor = pos.y - (-4.0);
    vOpacity = smoothstep(0.0, 1.0, distToFloor);
  }
`;

const FRAGMENT_SHADER = `
  varying float vOpacity;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Soft blurry snowflake
    float alpha = (1.0 - dist * 2.0);
    
    // Apply fade out from vertex shader
    // Reduced global opacity to 0.5 for subtlety
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vOpacity * 0.5);
  }
`;

export const SnowSystem: React.FC = () => {
  const points = useRef<THREE.Points>(null);
  
  const { positions, sizes, speeds } = useMemo(() => {
    const p = new Float32Array(SNOW_COUNT * 3);
    const s = new Float32Array(SNOW_COUNT);
    const sp = new Float32Array(SNOW_COUNT);
    
    for (let i = 0; i < SNOW_COUNT; i++) {
        p[i*3] = (Math.random() - 0.5) * SPAWN_RANGE_X;
        p[i*3+1] = Math.random() * SPAWN_RANGE_Y; 
        p[i*3+2] = (Math.random() - 0.5) * SPAWN_RANGE_Z;
        
        s[i] = 1.0 + Math.random() * 2.0; // Smaller size
        sp[i] = 1.0 + Math.random() * 2.0;
    }
    
    return { positions: p, sizes: s, speeds: sp };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (points.current && points.current.material) {
        (points.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={points} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={SNOW_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={SNOW_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-speed" count={SNOW_COUNT} array={speeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial 
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
};
