"use client";

import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";

interface FrameRateMonitorOptions {
  targetFPS?: number;
  sampleSize?: number;
  onDowngrade?: () => void;
  onUpgrade?: () => void;
}

interface FrameRateMonitorResult {
  currentFPS: number;
  isPerformanceGood: boolean;
}

// Hook to monitor frame rate and trigger callbacks when performance degrades
export function useFrameRateMonitor({
  targetFPS = 30,
  sampleSize = 60,
  onDowngrade,
  onUpgrade,
}: FrameRateMonitorOptions = {}): FrameRateMonitorResult {
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const currentFPSRef = useRef(60);
  const isGoodRef = useRef(true);
  const consecutiveLowRef = useRef(0);
  const consecutiveHighRef = useRef(0);
  const hasDowngradedRef = useRef(false);

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Add frame time to samples
    frameTimesRef.current.push(delta);
    if (frameTimesRef.current.length > sampleSize) {
      frameTimesRef.current.shift();
    }

    // Only calculate FPS after we have enough samples
    if (frameTimesRef.current.length >= sampleSize / 2) {
      const avgFrameTime =
        frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      currentFPSRef.current = Math.round(1000 / avgFrameTime);

      // Check if we need to downgrade
      if (currentFPSRef.current < targetFPS) {
        consecutiveLowRef.current++;
        consecutiveHighRef.current = 0;

        // Downgrade after 2 seconds of low FPS
        if (consecutiveLowRef.current > 120 && !hasDowngradedRef.current) {
          isGoodRef.current = false;
          hasDowngradedRef.current = true;
          onDowngrade?.();
        }
      } else if (currentFPSRef.current >= targetFPS + 10) {
        consecutiveHighRef.current++;
        consecutiveLowRef.current = 0;

        // Upgrade after 5 seconds of good FPS (if previously downgraded)
        if (consecutiveHighRef.current > 300 && hasDowngradedRef.current) {
          isGoodRef.current = true;
          hasDowngradedRef.current = false;
          onUpgrade?.();
        }
      }
    }
  });

  return {
    currentFPS: currentFPSRef.current,
    isPerformanceGood: isGoodRef.current,
  };
}

// Standalone hook for checking reduced motion preference
export function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
}
