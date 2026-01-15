"use client";

import { useState, useEffect } from "react";

export type PerformanceTier = "high" | "medium" | "low";

export interface PerformanceConfig {
  tier: PerformanceTier;
  nodeCount: number;
  maxConnectionsPerNode: number;
  connectionThreshold: number;
  bloomIntensity: number;
  enableBloom: boolean;
  dpr: number;
  pulseSpeed: number;
  curveSegments: number;
}

const HIGH_CONFIG: PerformanceConfig = {
  tier: "high",
  nodeCount: 400,
  maxConnectionsPerNode: 4,
  connectionThreshold: 9,
  bloomIntensity: 0.7,
  enableBloom: true,
  dpr: 1,
  pulseSpeed: 0.5,
  curveSegments: 4,
};

const MEDIUM_CONFIG: PerformanceConfig = {
  tier: "medium",
  nodeCount: 250,
  maxConnectionsPerNode: 3,
  connectionThreshold: 10,
  bloomIntensity: 0.5,
  enableBloom: true,
  dpr: 0.75,
  pulseSpeed: 0.4,
  curveSegments: 3,
};

const LOW_CONFIG: PerformanceConfig = {
  tier: "low",
  nodeCount: 150,
  maxConnectionsPerNode: 2,
  connectionThreshold: 12,
  bloomIntensity: 0,
  enableBloom: false,
  dpr: 0.5,
  pulseSpeed: 0.3,
  curveSegments: 2,
};

function detectGPUTier(): "high" | "medium" | "low" | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "low";

    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return null;

    const renderer = (gl as WebGLRenderingContext)
      .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      .toLowerCase();

    // High-end GPUs
    if (
      renderer.includes("nvidia") ||
      renderer.includes("geforce") ||
      renderer.includes("rtx") ||
      renderer.includes("gtx") ||
      renderer.includes("radeon rx") ||
      renderer.includes("radeon pro") ||
      renderer.includes("apple m1 pro") ||
      renderer.includes("apple m1 max") ||
      renderer.includes("apple m2 pro") ||
      renderer.includes("apple m2 max") ||
      renderer.includes("apple m3") ||
      renderer.includes("apple m4")
    ) {
      return "high";
    }

    // Medium GPUs (integrated but decent)
    if (
      renderer.includes("apple m1") ||
      renderer.includes("apple m2") ||
      renderer.includes("intel iris") ||
      renderer.includes("intel uhd") ||
      renderer.includes("radeon")
    ) {
      return "medium";
    }

    // Low-end
    if (
      renderer.includes("intel hd") ||
      renderer.includes("mali") ||
      renderer.includes("adreno") ||
      renderer.includes("powervr") ||
      renderer.includes("swiftshader")
    ) {
      return "low";
    }

    return null;
  } catch {
    return null;
  }
}

function detectPerformanceTier(): PerformanceTier {
  // Start with baseline assumptions
  let score = 0;

  // Check device memory (RAM)
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory) {
    if (memory >= 8) score += 2;
    else if (memory >= 4) score += 1;
    else score -= 1;
  }

  // Check CPU cores
  const cores = navigator.hardwareConcurrency;
  if (cores) {
    if (cores >= 8) score += 2;
    else if (cores >= 4) score += 1;
    else score -= 1;
  }

  // Check GPU
  const gpuTier = detectGPUTier();
  if (gpuTier === "high") score += 3;
  else if (gpuTier === "medium") score += 1;
  else if (gpuTier === "low") score -= 2;

  // Check connection speed (for initial load, not rendering)
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  if (connection?.effectiveType) {
    if (connection.effectiveType === "4g") score += 1;
    else if (connection.effectiveType === "3g") score -= 0;
    else score -= 1;
  }

  // Check battery status (reduce if low/not charging)
  // This is async so we'll handle it separately with an update

  // Determine tier based on score (stricter thresholds for better performance on more devices)
  // High: Only truly powerful machines (score >= 6)
  // Medium: Decent machines (score >= 3)  
  // Low: Everything else
  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

export function usePerformanceTier(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>(MEDIUM_CONFIG);

  useEffect(() => {
    // Initial detection
    const tier = detectPerformanceTier();
    const newConfig = tier === "high" ? HIGH_CONFIG : tier === "medium" ? MEDIUM_CONFIG : LOW_CONFIG;
    setConfig(newConfig);

    // Check battery status and potentially downgrade
    if ("getBattery" in navigator) {
      (navigator as Navigator & { getBattery: () => Promise<{ level: number; charging: boolean }> })
        .getBattery()
        .then((battery) => {
          if (battery.level < 0.2 && !battery.charging) {
            // Downgrade one tier if on low battery
            if (tier === "high") {
              setConfig(MEDIUM_CONFIG);
            } else if (tier === "medium") {
              setConfig(LOW_CONFIG);
            }
          }
        })
        .catch(() => {
          // Battery API not available, keep current config
        });
    }
  }, []);

  return config;
}
