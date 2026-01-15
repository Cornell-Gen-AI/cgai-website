"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceTier, PerformanceConfig } from "@/hooks/usePerformanceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useNodeNetwork } from "./useNodeNetwork";
import { NodeCloudBillboard } from "./NodeCloudBillboard";
import { ConnectionLinesOptimized } from "./ConnectionLinesOptimized";
import { AnimatedCamera } from "./AnimatedCamera";
import { useFrameRateMonitor } from "@/hooks/useFrameRateMonitor";

// Check if OffscreenCanvas is supported
function supportsOffscreenCanvas(): boolean {
  if (typeof window === "undefined") return false;
  return typeof OffscreenCanvas !== "undefined" && typeof Worker !== "undefined";
}

// Fallback 2D background for mobile (matching existing site design)
function FallbackBackground() {
  return (
    <>
      {/* Large blobs */}
      <div className="absolute -top-24 -left-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff]"></div>
      <div className="absolute -bottom-24 -right-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#c55bff] via-[#7b5bff] to-[#5b9dff]"></div>
      
      {/* Medium blobs */}
      <div className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#4a8eff] via-[#6a4aff] to-[#b44aff]"></div>
      <div className="absolute bottom-1/3 left-1/3 h-[250px] w-[250px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
      
      {/* Small blobs */}
      <div className="absolute top-1/2 left-[16.67%] h-[200px] w-[200px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#3d7eff] via-[#5d3dff] to-[#a73dff]"></div>
      <div className="absolute top-[16.67%] right-[16.67%] h-[180px] w-[180px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
      <div className="absolute bottom-1/4 left-1/2 h-[150px] w-[150px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#5e9fff] via-[#7e5eff] to-[#c85eff]"></div>
      
      {/* Tiny accent blobs */}
      <div className="absolute top-3/4 right-1/3 h-[120px] w-[120px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#4f8fff] via-[#6f4fff] to-[#b94fff]"></div>
      <div className="absolute bottom-[16.67%] right-[16.67%] h-[100px] w-[100px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
      <div className="absolute top-1/3 left-1/4 h-[80px] w-[80px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
    </>
  );
}

// Inner 3D scene component (needs to be inside Canvas)
interface SceneProps {
  config: PerformanceConfig;
  reducedMotion: boolean;
  onDowngrade: () => void;
}

function Scene({ config, reducedMotion, onDowngrade }: SceneProps) {
  const network = useNodeNetwork({
    nodeCount: config.nodeCount,
    brainWidth: 20,
    brainHeight: 15,
    brainDepth: 25,
    connectionThreshold: config.connectionThreshold,
    maxConnectionsPerNode: config.maxConnectionsPerNode,
  });

  // Monitor frame rate and trigger downgrade if needed
  useFrameRateMonitor({
    targetFPS: 25,
    sampleSize: 60,
    onDowngrade,
  });

  // Calculate pulse percentage based on tier
  const pulsePercentage = config.tier === "high" ? 0.3 : config.tier === "medium" ? 0.2 : 0.1;

  return (
    <>
      <AnimatedCamera
        pathRadiusX={4}
        pathRadiusZ={5}
        pathSpeed={reducedMotion ? 0 : 0.06}
        verticalAmount={2}
      />
      
      {/* Use 2D billboard nodes for better performance */}
      <NodeCloudBillboard 
        network={network} 
        pulseSpeed={reducedMotion ? 0 : 0.4} 
        baseSize={0.08} 
      />
      
      {/* Optimized connection lines with GPU-based pulse animation */}
      <ConnectionLinesOptimized 
        network={network} 
        pulseSpeed={config.pulseSpeed} 
        baseOpacity={0.18} 
        pulseSize={0.08}
        reducedMotion={reducedMotion}
        pulsePercentage={pulsePercentage}
      />

      {/* Post-processing for subtle organic glow - conditional based on performance tier */}
      {config.enableBloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={config.bloomIntensity}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

// Offscreen Canvas Worker-based renderer
interface OffscreenRendererProps {
  config: PerformanceConfig;
  reducedMotion: boolean;
  onFallback: () => void;
}

function OffscreenRenderer({ config, reducedMotion, onFallback }: OffscreenRendererProps) {
  const canvasRef = useState<HTMLCanvasElement | null>(null);
  const workerRef = useState<Worker | null>(null);
  const [canvasEl, setCanvasEl] = canvasRef;
  const [worker, setWorker] = workerRef;

  useEffect(() => {
    if (!canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    let offscreen: OffscreenCanvas;
    try {
      offscreen = canvasEl.transferControlToOffscreen();
    } catch {
      // Canvas already transferred or error - fall back to main thread
      onFallback();
      return;
    }

    // Create worker
    let newWorker: Worker;
    try {
      newWorker = new Worker(
        new URL("./NeuralNetworkWorker.worker.ts", import.meta.url),
        { type: "module" }
      );
    } catch {
      // Worker creation failed - fall back to main thread
      onFallback();
      return;
    }

    setWorker(newWorker);

    // Send initialization
    newWorker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        width,
        height,
        dpr: config.dpr,
        config: {
          nodeCount: config.nodeCount,
          maxConnectionsPerNode: config.maxConnectionsPerNode,
          connectionThreshold: config.connectionThreshold,
          bloomEnabled: config.enableBloom,
          bloomIntensity: config.bloomIntensity,
          pulseSpeed: config.pulseSpeed,
          reducedMotion,
        },
      },
      [offscreen]
    );

    // Handle resize
    const handleResize = () => {
      const rect = canvasEl.getBoundingClientRect();
      newWorker.postMessage({
        type: "resize",
        width: rect.width || window.innerWidth,
        height: rect.height || window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      newWorker.terminate();
      setWorker(null);
    };
  }, [canvasEl, config, reducedMotion, onFallback, setWorker]);

  // Update config when it changes
  useEffect(() => {
    if (!worker) return;

    worker.postMessage({
      type: "updateConfig",
      config: {
        nodeCount: config.nodeCount,
        maxConnectionsPerNode: config.maxConnectionsPerNode,
        connectionThreshold: config.connectionThreshold,
        bloomEnabled: config.enableBloom,
        bloomIntensity: config.bloomIntensity,
        pulseSpeed: config.pulseSpeed,
        reducedMotion,
      },
    });
  }, [worker, config, reducedMotion]);

  return (
    <canvas
      ref={setCanvasEl}
      className="h-full w-full"
      style={{ background: "transparent" }}
    />
  );
}

export interface NeuralNetworkSceneProps {
  className?: string;
  useOffscreen?: boolean; // Force offscreen mode (default: auto-detect)
}

export function NeuralNetworkScene({ className = "", useOffscreen }: NeuralNetworkSceneProps) {
  const isMobile = useIsMobile();
  const [performanceConfig, setPerformanceConfig] = useState<PerformanceConfig | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const [useWorker, setUseWorker] = useState(false);
  const [workerFailed, setWorkerFailed] = useState(false);
  
  // Get initial performance config
  const initialConfig = usePerformanceTier();

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    setPerformanceConfig(initialConfig);
    
    // Decide whether to use offscreen canvas
    // Only use if explicitly requested or if device supports it and is high-tier
    const shouldUseOffscreen = useOffscreen ?? (
      supportsOffscreenCanvas() && 
      initialConfig.tier === "high"
    );
    setUseWorker(shouldUseOffscreen);
  }, [initialConfig, useOffscreen]);

  // Handle dynamic downgrade when FPS is too low
  const handleDowngrade = useCallback(() => {
    setPerformanceConfig((prev) => {
      if (!prev) return prev;
      
      // If already on low, fall back to 2D
      if (prev.tier === "low") {
        setForceFallback(true);
        return prev;
      }
      
      // Downgrade to next lower tier
      if (prev.tier === "high") {
        return {
          ...prev,
          tier: "medium" as const,
          nodeCount: 250,
          maxConnectionsPerNode: 3,
          connectionThreshold: 10,
          bloomIntensity: 0.5,
          dpr: 0.75,
          curveSegments: 3,
        };
      }
      
      // Medium -> Low
      return {
        ...prev,
        tier: "low" as const,
        nodeCount: 150,
        maxConnectionsPerNode: 2,
        connectionThreshold: 12,
        bloomIntensity: 0,
        enableBloom: false,
        dpr: 0.5,
        curveSegments: 2,
      };
    });
  }, []);

  // Handle worker failure - fall back to main thread
  const handleWorkerFallback = useCallback(() => {
    setWorkerFailed(true);
    setUseWorker(false);
  }, []);

  // Show nothing during SSR to prevent hydration mismatch
  if (!mounted || !performanceConfig) {
    return <div className={`h-full w-full ${className}`} />;
  }

  // Mobile or forced fallback (when 3D is too slow even at lowest settings)
  if (isMobile || forceFallback) {
    return <FallbackBackground />;
  }

  // Try offscreen canvas (Web Worker) if supported and enabled
  if (useWorker && !workerFailed) {
    return (
      <div className={`h-full w-full ${className}`}>
        <OffscreenRenderer
          config={performanceConfig}
          reducedMotion={reducedMotion}
          onFallback={handleWorkerFallback}
        />
      </div>
    );
  }

  // Main thread rendering with React Three Fiber
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        dpr={performanceConfig.dpr}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{
          fov: 75,
          near: 0.1,
          far: 150,
          position: [4, 0, 0],
        }}
        frameloop={reducedMotion ? "demand" : "always"}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene 
            config={performanceConfig} 
            reducedMotion={reducedMotion}
            onDowngrade={handleDowngrade}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
