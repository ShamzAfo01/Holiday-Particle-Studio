export enum ShapeType {
  HEART = 'Heart',
  FLOWER = 'Flower',
  FIREWORKS = 'Fireworks',
  TREE = 'Tree',
  RANDOM = 'Random'
}

export interface HandGestures {
  tension: number; // 0 to 1 (Hands apart)
  closure: number; // 0 to 1 (Fists closed)
  detected: boolean;
  leftOpenness: number;
  rightOpenness: number;
}

export interface ParticleConfig {
  count: number;
  color: string;
  shape: ShapeType;
  autoRotate: boolean;
}

// Map dates to lore shapes (Mapped to the restricted list)
export const DAILY_LORE: Record<string, ShapeType> = {
  '12-17': ShapeType.FLOWER, // Snowflake -> Flower pattern
  '12-18': ShapeType.HEART,
  '12-19': ShapeType.TREE,
  '12-20': ShapeType.FIREWORKS, // Bell -> Fireworks
  '12-21': ShapeType.FLOWER, // Wreath -> Flower
  '12-22': ShapeType.TREE,
  '12-23': ShapeType.TREE, // Star -> Tree (Top)
  '12-24': ShapeType.HEART, // Gift -> Heart
  '12-25': ShapeType.FIREWORKS, // Star -> Fireworks
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      shaderMaterial: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      mesh: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      group: any;
      cylinderGeometry: any;
      torusGeometry: any;
      sphereGeometry: any;
      latheGeometry: any;
      fog: any;
      primitive: any;
    }
  }
}
