
import React, { useMemo } from 'react';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally displace plane to look like snow piles
const SnowMesh: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 64, 64);
    const posAttribute = geo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i); // This is Z in world space before rotation
      
      const z = 
        Math.sin(x * 0.2) * 0.5 + 
        Math.cos(y * 0.15) * 0.5 + 
        Math.sin(x * 0.5 + y * 0.5) * 0.2;
      
      posAttribute.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#ffffff" 
        roughness={0.9} 
        metalness={0.1}
      />
    </mesh>
  );
};

interface StyledTextProps {
    text: string;
    position: [number, number, number];
    colors?: string[];
}

const StyledText: React.FC<StyledTextProps> = ({ text, position, colors = ['#D42426', '#165B33', '#FFD700'] }) => {
    const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

    return (
        <group position={position} rotation={[-0.1, 0, 0]}>
            {text.split('').map((char, index) => {
                const color = colors[index % colors.length];
                const xPos = index * 1.1;
                const rot = [(Math.random()-0.5)*0.1, (Math.random() - 0.5) * 0.2, (Math.random()-0.5)*0.1];
                
                return (
                <group key={index} position={[xPos, 0, 0]} rotation={[rot[0], rot[1], rot[2]] as any}>
                    {/* 1. Main Color Letter */}
                    <Text3D
                    font={fontUrl}
                    size={1.2}
                    height={0.3}
                    bevelEnabled
                    bevelSize={0.02}
                    bevelThickness={0.02}
                    >
                    {char}
                    <meshStandardMaterial 
                        color={color} 
                        roughness={0.2} 
                        metalness={0.6} 
                    />
                    </Text3D>

                    {/* 2. Snow Cap (White layer on top) */}
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
                    <meshStandardMaterial 
                        color="#ffffff" 
                        roughness={1} 
                        emissive="#ffffff"
                        emissiveIntensity={0.2}
                    />
                    </Text3D>
                    
                    {/* 3. Gold Trim (Layer behind) */}
                    <Text3D
                    font={fontUrl}
                    size={1.25}
                    height={0.1}
                    position={[-0.025, -0.025, -0.1]} 
                    bevelEnabled={false}
                    >
                    {char}
                    <meshStandardMaterial 
                        color="#FFD700" 
                        metalness={1} 
                        roughness={0.2}
                    />
                    </Text3D>
                </group>
                );
            })}
        </group>
    );
}

// 3D Text Component with Decorations
const FestiveText: React.FC = () => {
  // Get Current Date
  const dateStr = useMemo(() => {
      const d = new Date();
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return `${months[d.getMonth()]} ${d.getDate()}`;
  }, []);

  return (
    <group position={[0, -4.0, 4]}>
      {/* Left: MERRY */}
      {/* 5 letters * 1.1 width approx = 5.5 units */}
      <StyledText text="MERRY" position={[-12, 0, 0]} />
      
      {/* Center: DATE */}
      {/* Date is approx 6 chars. Center it. */}
      {/* We use purely Gold/White for the date to distinguish it */}
      <StyledText text={dateStr} position={[-3.5, 0, 1]} colors={['#FFD700']} />

      {/* Right: CHRISTMAS */}
      {/* 9 letters * 1.1 = 9.9 units */}
      <StyledText text="CHRISTMAS" position={[4, 0, 0]} />
    </group>
  );
};

// Scattered Ornaments and Gifts
const ScatteredDecorations: React.FC = () => {
  const items = useMemo(() => {
    const temp = [];
    // Ornaments
    for(let i=0; i<15; i++) {
        temp.push({
            type: 'sphere',
            x: (Math.random() - 0.5) * 26, // Widened spread for longer text
            z: (Math.random() - 0.5) * 10 + 6,
            scale: Math.random() * 0.3 + 0.2,
            color: Math.random() > 0.5 ? '#D42426' : '#FFD700',
            rotation: 0
        })
    }
    // Gift Boxes
    for(let i=0; i<8; i++) {
        temp.push({
            type: 'box',
            x: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 4 + 6,
            scale: Math.random() * 0.5 + 0.6,
            color: Math.random() > 0.5 ? '#2f855a' : '#c53030', 
            rotation: Math.random() * Math.PI
        })
    }
    return temp;
  }, []);

  return (
    <group position={[0, -4.2, 0]}>
        {items.map((item, i) => (
            <group key={i} position={[item.x, 0.2, item.z]} rotation={[0, item.rotation, 0]}>
                {item.type === 'sphere' ? (
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[item.scale, 32, 32]} />
                        <meshStandardMaterial color={item.color} metalness={0.8} roughness={0.1} />
                    </mesh>
                ) : (
                    <group>
                        <mesh castShadow receiveShadow position={[0, item.scale/2, 0]}>
                            <boxGeometry args={[item.scale, item.scale, item.scale]} />
                            <meshStandardMaterial color={item.color} metalness={0.3} roughness={0.4} />
                        </mesh>
                        <mesh position={[0, item.scale/2, 0]} scale={[1.02, 1.02, 0.2]}>
                             <boxGeometry args={[item.scale, item.scale, item.scale]} />
                             <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
                        </mesh>
                         <mesh position={[0, item.scale/2, 0]} scale={[0.2, 1.02, 1.02]}>
                             <boxGeometry args={[item.scale, item.scale, item.scale]} />
                             <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.3} />
                        </mesh>
                    </group>
                )}
            </group>
        ))}
        <pointLight position={[-5, 2, 8]} intensity={1} color="#ffddaa" distance={10} />
        <pointLight position={[5, 2, 8]} intensity={1} color="#ffddaa" distance={10} />
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
