
import React from 'react';

export enum ShapeType {
  HEART = 'Heart',
  FLOWER = 'Flower',
  FIREWORKS = 'Fireworks',
  TREE = 'Tree',
  RANDOM = 'Random'
}

export interface HandGestures {
  tension: number; 
  closure: number; 
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

export enum OnboardingStep {
  CLICK_TWICE,
  PICK_GIFT,
  DONE
}

export interface GiftLoreItem {
  day: number;
  title: string;
  description: string;
  emoji: string;
}

export const GIFT_LORE: Record<string, GiftLoreItem> = {
  '12-1': { day: 1, title: 'Advent Dawn', description: 'The first candle is lit, casting a warm glow on the winter frost.', emoji: '🕯️' },
  '12-2': { day: 2, title: 'Gingerbread Spice', description: 'The kitchen fills with the scent of cinnamon and warm memories.', emoji: '🍪' },
  '12-3': { day: 3, title: 'Winter Pine', description: 'Deep in the forest, the trees stand tall and proud in their white coats.', emoji: '🌲' },
  '12-4': { day: 4, title: 'Frosted Window', description: 'Jack Frost leaves his delicate patterns for the morning sun to find.', emoji: '❄️' },
  '12-5': { day: 5, title: 'Mistletoe Kiss', description: 'A moment of warmth shared beneath the green leaves of winter.', emoji: '🌿' },
  '12-6': { day: 6, title: 'St. Nicholas Day', description: 'Shoes filled with treats and hearts filled with anticipation.', emoji: '👞' },
  '12-7': { day: 7, title: 'Silver Bells', description: 'The rhythmic chime of celebration echoes across the snowy valley.', emoji: '🔔' },
  '12-8': { day: 8, title: 'Northern Lights', description: 'The sky dances in curtains of green and violet above the poles.', emoji: '🌌' },
  '12-9': { day: 9, title: 'Sleigh Bells', description: 'The sound of travel through the silence of a midnight forest.', emoji: '🛷' },
  '12-10': { day: 10, title: 'Starlight Eve', description: 'The stars shine brightest tonight, guiding travelers home.', emoji: '⭐' },
  '12-11': { day: 11, title: 'Candy Cane Lane', description: 'Sweetness and stripes lead the way to festive celebrations.', emoji: '🍭' },
  '12-12': { day: 12, title: 'Snowball Fight', description: 'Laughter rings out as white clouds fly through the crisp air.', emoji: '⚪' },
  '12-13': { day: 13, title: 'Lucia Lights', description: 'Bearing candles through the darkest night to welcome the dawn.', emoji: '🕯️' },
  '12-14': { day: 14, title: 'Christmas Sweater', description: 'Cozy wool and bold patterns keeping the holiday spirit warm.', emoji: '🧶' },
  '12-15': { day: 15, title: 'Frozen Lake', description: 'Graceful skaters glide on the mirrored surface of the winter woods.', emoji: '⛸️' },
  '12-16': { day: 16, title: 'Cozy Hearth', description: 'The smell of pine and cider fills the air as the fire crackles.', emoji: '🔥' },
  '12-17': { day: 17, title: 'A Partridge in a Pear Tree', description: 'Symbolizing the start of the festive journey, a beacon of peace.', emoji: '🐦‍⬛' },
  '12-18': { day: 18, title: 'Two Turtle Doves', description: 'Representing love and friendship that blossoms in the winter frost.', emoji: '🕊️' },
  '12-19': { day: 19, title: 'Three French Hens', description: 'Faith, Hope, and Charity arriving with the evening snow.', emoji: '🐔' },
  '12-20': { day: 20, title: 'Four Calling Birds', description: 'Spreading the joyous word across the frozen hills.', emoji: '🐦' },
  '12-21': { day: 21, title: 'Five Golden Rings', description: 'The precious gift of togetherness, unbroken and shining.', emoji: '💍' },
  '12-22': { day: 22, title: 'Six Geese a-Laying', description: 'The creation of new traditions and the promise of tomorrow.', emoji: '🪿' },
  '12-23': { day: 23, title: 'Seven Swans a-Swimming', description: 'Grace and beauty flowing through the holiday spirit.', emoji: '🦢' },
  '12-24': { day: 24, title: 'Eight Maids a-Milking', description: 'The humble heart of Christmas Eve, providing for all.', emoji: '🥛' },
  '12-25': { day: 25, title: 'Nine Ladies Dancing', description: 'Pure celebration as the morning light breaks on Christmas Day!', emoji: '💃' },
};

declare module 'react' {
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
      pointsMaterial: any;
      boxGeometry: any;
      [elemName: string]: any;
    }
  }
}

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
      pointsMaterial: any;
      boxGeometry: any;
      [elemName: string]: any;
    }
  }
}
