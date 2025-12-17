
import * as THREE from 'three';
import { ShapeType } from '../types';

// Helper to get random point in sphere
const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
};

export const generateShapePositions = (type: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;

    switch (type) {
      case ShapeType.HEART: {
        // High Quality Volume Heart Rejection Sampling
        // Using formula: (x^2 + 9/4y^2 + z^2 - 1)^3 - x^2z^3 - 9/80y^2z^3 < 0
        let done = false;
        while (!done) {
            // Sample bounding box
            const rx = (Math.random() - 0.5) * 3.0;
            const ry = (Math.random() - 0.5) * 3.0;
            const rz = (Math.random() - 0.5) * 1.5; // Flatter in Z
            
            const px = rx;
            const py = ry;
            const pz = rz;

            // Heart equation
            const a = px*px + (9/4)*py*py + pz*pz - 1;
            const val = a*a*a - px*px*pz*pz*pz - (9/80)*py*py*pz*pz*pz;

            if (val < 0) {
                // Scale up
                x = px * 3.5;
                y = py * 3.5 + 1.0; // Shift up slightly
                z = pz * 3.5;
                done = true;
            }
        }
        break;
      }
      case ShapeType.FLOWER: {
        // Volumetric Flower
        const r = 2.5 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const petals = 6;
        // Flower shape modulation
        const petalShape = Math.abs(Math.sin(theta * petals * 0.5));
        const radius = r * (0.3 + 0.7 * petalShape);
        
        // Add volume thickness
        const thickness = 0.4 * (1 - r/3);
        z = (Math.random() - 0.5) * thickness;
        
        // Cup shape
        z += Math.pow(radius, 2) * 0.15;
        
        x = radius * Math.cos(theta);
        y = radius * Math.sin(theta);
        
        // Rotate to face camera
        const tempY = y;
        y = z * 2; // Make it stand up
        z = tempY * 0.5;
        break;
      }
      case ShapeType.TREE: {
        // Volumetric Cone Tree
        const h = (Math.random() * 4) - 2; // -2 to 2
        const normH = (h + 2) / 4; // 0 (bottom) to 1 (top)
        
        // Radius gets smaller as we go up
        const maxR = 1.8 * (1.0 - normH);
        
        // Fill the volume of the cone
        const r = Math.sqrt(Math.random()) * maxR;
        const theta = Math.random() * Math.PI * 2;
        
        x = r * Math.cos(theta);
        z = r * Math.sin(theta);
        y = h;
        
        // Add layers/branches texture
        const layer = Math.floor(normH * 5);
        const layerOffset = (normH * 5) - layer;
        x *= 1.0 + (layerOffset * 0.2);
        z *= 1.0 + (layerOffset * 0.2);
        break;
      }
      case ShapeType.FIREWORKS: {
        // Explosion sphere with trails
        // Core
        if (Math.random() < 0.2) {
            const p = randomInSphere(0.5);
            x = p.x; y = p.y; z = p.z;
        } else {
            // Rays
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const dist = 0.5 + Math.pow(Math.random(), 0.5) * 3.5;
            
            x = dist * Math.sin(phi) * Math.cos(theta);
            y = dist * Math.sin(phi) * Math.sin(theta);
            z = dist * Math.cos(phi);
        }
        break;
      }
      default: {
        // Random Cloud
        const p = randomInSphere(2.5);
        x = p.x; y = p.y; z = p.z;
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};
