
import React, { useMemo } from 'react';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const SnowMesh: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 64, 64);
    const posAttribute = geo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = 
        Math.sin(x * 0.15) * 0.6 + 
        Math.cos(y * 0.12) * 0.6 + 
        Math.sin(x * 0.4 + y * 0.4) * 0.3;
      posAttribute.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#ffffff" 
        roughness={1} 
        metalness={0.0}
      />
    </mesh>
  );
};

interface StyledTextProps {
    text: string;
    position: [number, number, number];
    colors?: string[];
    scale?: number;
    useNormalWhite?: boolean;
}

const StyledText: React.FC<StyledTextProps> = ({ text, position, colors = ['#D42426', '#165B33', '#FFD700'], scale = 1.0, useNormalWhite = false }) => {
    const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

    if (useNormalWhite) {
      return (
        <group position={position} scale={scale}>
          <Text3D font={fontUrl} size={1.2} height={0.1}>
            {text}
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
          </Text3D>
        </group>
      );
    }

    return (
        <group position={position} rotation={[-0.1, 0, 0]} scale={scale}>
            {text.split('').map((char, index) => {
                const color = colors[index % colors.length];
                const xPos = index * 1.1;
                const rot = [(Math.random()-0.5)*0.05, (Math.random() - 0.5) * 0.1, (Math.random()-0.5)*0.05];
                
                return (
                <group key={index} position={[xPos, 0, 0]} rotation={[rot[0], rot[1], rot[2]] as any}>
                    {/* Main Color Letter */}
                    <Text3D
                    font={fontUrl}
                    size={1.2}
                    height={0.3}
                    bevelEnabled
                    bevelSize={0.02}
                    bevelThickness={0.02}
                    >
                    {char}
                    <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
                    </Text3D>

                    {/* Snow Cap */}
                    <Text3D
                    font={fontUrl}
                    size={1.2}
                    height={0.1}
                    position={[0, 0.25, 0.05]} 
                    scale={[1, 0.8, 1]} 
                    bevelEnabled
                    bevelSize={0.03}
                    bevelThickness={0.02}
                    >
                    {char}
                    <meshStandardMaterial color="#ffffff" roughness={1} emissive="#ffffff" emissiveIntensity={0.2} />
                    </Text3D>
                    
                    {/* Gold Trim */}
                    <Text3D
                    font={fontUrl}
                    size={1.25}
                    height={0.1}
                    position={[-0.025, -0.025, -0.1]} 
                    bevelEnabled={false}
                    >
                    {char}
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                    </Text3D>
                </group>
                );
            })}
        </group>
    );
}

const FestiveText: React.FC = () => {
  const dateStr = useMemo(() => {
      const d = new Date();
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${months[d.getMonth()]} ${d.getDate()}`;
  }, []);

  return (
    <group position={[0, -4.4, 4]}>
      {/* Date above MERRY */}
      <StyledText text={dateStr} position={[-14, 2.0, 0]} useNormalWhite={true} scale={0.5} />

      {/* Left: MERRY */}
      <StyledText text="MERRY" position={[-14, 0, 0]} />
      
      {/* Right: CHRISTMAS */}
      <StyledText text="CHRISTMAS" position={[-5, 0, 0]} />
    </group>
  );
};

const ScatteredDecorations: React.FC = () => {
  const items = useMemo(() => {
    const temp = [];
    for(let i=0; i<20; i++) {
        temp.push({
            type: 'sphere',
            x: (Math.random() - 0.5) * 40,
            z: (Math.random() - 0.5) * 15 + 6,
            scale: Math.random() * 0.3 + 0.2,
            color: Math.random() > 0.5 ? '#D42426' : '#FFD700',
            rotation: 0
        })
    }
    for(let i=0; i<12; i++) {
        temp.push({
            type: 'box',
            x: (Math.random() - 0.5) * 35,
            z: (Math.random() - 0.5) * 8 + 6,
            scale: Math.random() * 0.5 + 0.6,
            color: Math.random() > 0.5 ? '#165B33' : '#D42426', 
            rotation: Math.random() * Math.PI
        })
    }
    return temp;
  }, []);

  return (
    <group position={[0, -4.5, 0]}>
        {items.map((item, i) => (
            <group key={i} position={[item.x, 0.2, item.z]} rotation={[0, item.rotation, 0]}>
                {item.type === 'sphere' ? (
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[item.scale, 32, 32]} />
                        <meshStandardMaterial color={item.color} metalness={0.9} roughness={0.1} />
                    </mesh>
                ) : (
                    <group>
                        <mesh castShadow receiveShadow position={[0, item.scale/2, 0]}>
                            <boxGeometry args={[item.scale, item.scale, item.scale]} />
                            <meshStandardMaterial color={item.color} metalness={0.3} roughness={0.4} />
                        </mesh>
                        <mesh position={[0, item.scale/2, 0]} scale={[1.05, 1.05, 0.1]}>
                             <boxGeometry args={[item.scale, item.scale, item.scale]} />
                             <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
                        </mesh>
                         <mesh position={[0, item.scale/2, 0]} scale={[0.1, 1.05, 1.05]}>
                             <boxGeometry args={[item.scale, item.scale, item.scale]} />
                             <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
                        </mesh>
                    </group>
                )}
            </group>
        ))}
    </group>
  )
}

export const SnowFloor: React.FC = () => {
  return (
    <group>
      <SnowMesh />
      <FestiveText />
      <ScatteredDecorations />
    </group>
  );
};
