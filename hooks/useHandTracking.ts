import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { HandGestures } from '../types';

const LERP_FACTOR = 0.1;

export const useHandTracking = (enabled: boolean) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Ref to store current gesture state to avoid React render loop jitter
  // We expose this via a getter or a very specific reactive state if needed
  // For high freq updates (60fps), we return the ref reader.
  const gestureState = useRef<HandGestures>({
    tension: 0,
    closure: 0,
    detected: false,
    leftOpenness: 1,
    rightOpenness: 1,
  });

  const rawGestureState = useRef({
    tension: 0,
    closure: 0,
  });

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', predictWebcam);
      }
    } catch (err) {
      console.error("Camera denied:", err);
      setHasPermission(false);
      setError("Camera access denied. Mouse controls enabled.");
    }
  };

  const predictWebcam = useCallback(async () => {
    if (!handLandmarkerRef.current || !videoRef.current) return;

    const nowInMs = Date.now();
    const results = handLandmarkerRef.current.detectForVideo(videoRef.current, nowInMs);

    if (results.landmarks && results.landmarks.length > 0) {
      let tension = 0;
      let leftClosure = 0;
      let rightClosure = 0;
      let detected = true;

      // 1. Calculate Tension (Distance between hands)
      if (results.landmarks.length === 2) {
        const hand1 = results.landmarks[0][0]; // Wrist
        const hand2 = results.landmarks[1][0]; // Wrist
        // Simple 2D distance in normalized coord space
        const dx = hand1.x - hand2.x;
        const dy = hand1.y - hand2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        // Normalize: dist usually 0.2 to 0.8
        tension = Math.min(Math.max((dist - 0.2) * 2.0, 0), 1);
      } else {
        // One hand or no hands - tension decays
        tension = rawGestureState.current.tension * 0.9;
      }

      // 2. Calculate Closure (Fist vs Open)
      results.landmarks.forEach((landmarks) => {
        // Simple heuristic: Tip to Wrist distance vs avg finger length
        // Wrist is index 0. Tips are 4, 8, 12, 16, 20
        const wrist = landmarks[0];
        let tipDistSum = 0;
        const tips = [8, 12, 16, 20]; // Skip thumb for simple curl check
        tips.forEach(idx => {
            const d = Math.sqrt(Math.pow(landmarks[idx].x - wrist.x, 2) + Math.pow(landmarks[idx].y - wrist.y, 2));
            tipDistSum += d;
        });
        const avgDist = tipDistSum / 4;
        // Tuned heuristic for normalized coords
        const isOpen = Math.min(Math.max((avgDist - 0.1) * 3, 0), 1); 
        
        // We accumulate closure (1 - openness)
        if (results.landmarks.length === 1) {
            leftClosure = 1 - isOpen;
            rightClosure = 1 - isOpen;
        } else {
            // Naive split, just avg them for global closure
            leftClosure += (1 - isOpen) * 0.5;
            rightClosure += (1 - isOpen) * 0.5;
        }
      });

      // Target Values
      const targetClosure = (leftClosure + rightClosure) / (results.landmarks.length || 1);
      
      // Update Raw (for next frame smoothing)
      rawGestureState.current.tension = tension;
      
      // Apply Smoothing to exposed state
      gestureState.current.detected = true;
      gestureState.current.tension += (tension - gestureState.current.tension) * LERP_FACTOR;
      gestureState.current.closure += (targetClosure - gestureState.current.closure) * LERP_FACTOR;
      gestureState.current.leftOpenness = 1 - leftClosure; // Simplified
      gestureState.current.rightOpenness = 1 - rightClosure;

    } else {
      gestureState.current.detected = false;
      // Decay to neutral
      gestureState.current.tension += (0 - gestureState.current.tension) * 0.05;
      gestureState.current.closure += (0 - gestureState.current.closure) * 0.05;
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  }, []);

  useEffect(() => {
    const init = async () => {
        if (!enabled) return;
        try {
            const vision = await FilesetResolver.forVisionTasks(".");
            handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `./hand_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 2
            });
            setLoading(false);
            setupCamera();
        } catch (e) {
            console.error(e);
            setError("Failed to load hand tracking model.");
            setLoading(false);
        }
    };
    init();
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [enabled, predictWebcam]);

  return { loading, error, hasPermission, videoRef, gestureState };
};