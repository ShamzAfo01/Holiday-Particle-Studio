
import React, { useMemo, useState, useRef } from 'react';
import { Text3D } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SnowMesh: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 100, 100);
    const posAttribute = geo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = 
        Math.sin(x * 0.1) * 1.2 + 
        Math.cos(y * 0.08) * 1.2 + 
        Math.sin(x * 0.2 + y * 0.2) * 0.5 +
        (Math.random() * 0.02);
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
        metalness={0.02}
      />
    </mesh>
  );
};

const GiftBox: React.FC<{ 
  position: [number, number, number], 
  scale: number, 
  color: string, 
  rotation: number,
  onOpen: () => void 
}> = ({ position, scale, color, rotation, onOpen }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { mouse, camera } = useThree();
  
  const velocity = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(...position));
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setShaking(true);
    setTimeout(() => {
      onOpen();
      setShaking(false);
    }, 450);
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const mousePlanePoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 4.8), mousePlanePoint);
      
      const distToMouse = mousePlanePoint.distanceTo(currentPos.current);
      if (distToMouse < 3.5) {
        const pushDir = currentPos.current.clone().sub(mousePlanePoint).normalize();
        const force = Math.max(0, 1.0 - distToMouse / 3.5) * 4.0;
        velocity.current.add(pushDir.multiplyScalar(force * delta));
      }

      const springDir = basePos.clone().sub(currentPos.current);
      velocity.current.add(springDir.multiplyScalar(1.5 * delta));
      
      velocity.current.multiplyScalar(0.9);
      currentPos.current.add(velocity.current);
      
      groupRef.current.position.copy(currentPos.current);

      if (shaking) {
        groupRef.current.position.x += (Math.random() - 0.5) * 0.4;
        groupRef.current.position.z += (Math.random() - 0.5) * 0.4;
        groupRef.current.rotation.z = (Math.random() - 0.5) * 0.15;
      } else {
        const targetY = hovered ? 0.3 : 0;
        groupRef.current.position.y += (targetY - (groupRef.current.position.y - basePos.y)) * 0.15;
        
        if (hovered) {
          groupRef.current.rotation.y += 0.04;
        } else {
          groupRef.current.rotation.y += (rotation - groupRef.current.rotation.y) * 0.05;
          groupRef.current.rotation.z *= 0.8;
        }
      }
    }
  });

  const ribbonColor = useMemo(() => {
    if (color === '#FFD700') return '#165B33';
    return '#FFD700';
  }, [color]);

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={[0, rotation, 0]}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Box Body (Base) */}
      <mesh castShadow receiveShadow position={[0, scale * 0.4, 0]}>
        <boxGeometry args={[scale, scale * 0.8, scale]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Lid - Slightly larger for realism */}
      <mesh castShadow receiveShadow position={[0, scale * 0.85, 0]}>
        <boxGeometry args={[scale * 1.05, scale * 0.15, scale * 1.05]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Ribbons */}
      <group position={[0, scale * 0.45, 0]}>
        {/* Horizontal Ribbons */}
        <mesh castShadow position={[0, scale * 0.4, 0]}>
          <boxGeometry args={[scale * 1.06, scale * 0.02, scale * 0.2]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI / 2, 0]} position={[0, scale * 0.4, 0]}>
          <boxGeometry args={[scale * 1.06, scale * 0.02, scale * 0.2]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Vertical Side Ribbons */}
        <mesh castShadow>
          <boxGeometry args={[scale + 0.01, scale * 0.9, scale * 0.2]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[scale + 0.01, scale * 0.9, scale * 0.2]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

const StyledText: React.FC<any> = ({ text, position, colors = ['#D42426', '#165B33', '#FFD700'], scale = 1.0, useNormalWhite = false }) => {
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

    const goldMaterial = new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 1.0, roughness: 0.1 });

    return (
        <group position={position} rotation={[-0.05, 0, 0]} scale={scale}>
            {text.split('').map((char: string, index: number) => {
                const color = colors[index % colors.length];
                const xPos = index * 1.35;
                
                return (
                <group key={index} position={[xPos, 0, 0]}>
                    <mesh position={[0.6, -1.8, 0]} material={goldMaterial} castShadow>
                        <cylinderGeometry args={[0.05, 0.05, 3.5, 12]} />
                    </mesh>
                    <Text3D font={fontUrl} size={1.4} height={0.5} bevelEnabled bevelSize={0.04} bevelThickness={0.04}>
                        {char}
                        <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
                    </Text3D>
                    <Text3D font={fontUrl} size={1.4} height={0.15} position={[0, 0.3, 0.1]} scale={[1.02, 0.8, 1]}>
                        {char}
                        <meshStandardMaterial color="#ffffff" roughness={1} />
                    </Text3D>
                </group>
                );
            })}
        </group>
    );
}

const FestiveText: React.FC = () => {
  const today = new Date();
  const dateStr = `DEC ${today.getDate()}`;

  return (
    <group position={[0, -4.4, 6]}>
      <StyledText text={dateStr} position={[-18, 3.4, 0]} useNormalWhite={true} scale={0.4} />
      <StyledText text="MERRY" position={[-18, 0, 0]} />
      <StyledText text="CHRISTMAS" position={[-8.5, 0, 0]} />
    </group>
  );
};

const ScatteredDecorations: React.FC<{ onOpenGift: () => void }> = ({ onOpenGift }) => {
  const items = useMemo(() => {
    const temp = [];
    const minDistance = 3.5; // Increased min distance to avoid overlaps

    const checkOverlap = (x: number, z: number) => {
      for (const item of temp) {
        const dx = item.x - x;
        const dz = item.z - z;
        if (Math.sqrt(dx*dx + dz*dz) < minDistance) return true;
      }
      return false;
    };

    for(let i=0; i<35; i++) { // Slightly fewer boxes for better spacing
        let x, z;
        let attempts = 0;
        do {
          x = (Math.random() - 0.5) * 60;
          z = (Math.random() - 0.5) * 35 + 8;
          attempts++;
        } while (checkOverlap(x, z) && attempts < 25);

        temp.push({
            type: 'box',
            x, z,
            scale: Math.random() * 0.3 + 0.8, // Slightly bigger boxes
            color: Math.random() > 0.5 ? (Math.random() > 0.5 ? '#165B33' : '#D42426') : '#FFD700', 
            rotation: Math.random() * Math.PI
        })
    }
    return temp;
  }, []);

  return (
    <group position={[0, -4.5, 0]}>
        {items.map((item, i) => (
            <GiftBox 
              key={i}
              position={[item.x, 0.1, item.z]} 
              scale={item.scale} 
              color={item.color} 
              rotation={item.rotation}
              onOpen={onOpenGift}
            />
        ))}
    </group>
  )
}

export const SnowFloor: React.FC<{ onOpenGift: () => void }> = ({ onOpenGift }) => {
  return (
    <group>
      <SnowMesh />
      <FestiveText />
      <ScatteredDecorations onOpenGift={onOpenGift} />
    </group>
  );
};
