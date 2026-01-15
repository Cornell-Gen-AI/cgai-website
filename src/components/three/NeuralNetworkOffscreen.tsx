"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceTier, PerformanceConfig } from "@/hooks/usePerformanceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Fallback 2D background for mobile
function FallbackBackground() {
  return (
    <>
      <div className="absolute -top-24 -left-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff]"></div>
      <div className="absolute -bottom-24 -right-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#c55bff] via-[#7b5bff] to-[#5b9dff]"></div>
      <div className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#4a8eff] via-[#6a4aff] to-[#b44aff]"></div>
      <div className="absolute bottom-1/3 left-1/3 h-[250px] w-[250px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
      <div className="absolute top-1/2 left-[16.67%] h-[200px] w-[200px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#3d7eff] via-[#5d3dff] to-[#a73dff]"></div>
      <div className="absolute top-[16.67%] right-[16.67%] h-[180px] w-[180px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
      <div className="absolute bottom-1/4 left-1/2 h-[150px] w-[150px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#5e9fff] via-[#7e5eff] to-[#c85eff]"></div>
      <div className="absolute top-3/4 right-1/3 h-[120px] w-[120px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#4f8fff] via-[#6f4fff] to-[#b94fff]"></div>
      <div className="absolute bottom-[16.67%] right-[16.67%] h-[100px] w-[100px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
      <div className="absolute top-1/3 left-1/4 h-[80px] w-[80px] rounded-full blur-3xl opacity-[0.08] bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
    </>
  );
}

export interface NeuralNetworkOffscreenProps {
  className?: string;
}

export function NeuralNetworkOffscreen({ className = "" }: NeuralNetworkOffscreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const isMobile = useIsMobile();
  const performanceConfig = usePerformanceTier();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [supportsOffscreen, setSupportsOffscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if OffscreenCanvas is supported
    setSupportsOffscreen(typeof OffscreenCanvas !== "undefined");
  }, []);

  // Initialize worker and offscreen canvas
  useEffect(() => {
    if (!mounted || !supportsOffscreen || isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    // Transfer canvas to offscreen
    let offscreen: OffscreenCanvas;
    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch {
      // Canvas already transferred or not supported
      return;
    }

    // Create worker
    const worker = new Worker(
      new URL("./NeuralNetworkWorker.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    // Send initialization message
    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        width,
        height,
        dpr: performanceConfig.dpr,
        config: {
          nodeCount: performanceConfig.nodeCount,
          maxConnectionsPerNode: performanceConfig.maxConnectionsPerNode,
          connectionThreshold: performanceConfig.connectionThreshold,
          bloomEnabled: performanceConfig.enableBloom,
          bloomIntensity: performanceConfig.bloomIntensity,
          pulseSpeed: performanceConfig.pulseSpeed,
          reducedMotion,
        },
      },
      [offscreen]
    );

    // Handle resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      worker.postMessage({
        type: "resize",
        width: rect.width || window.innerWidth,
        height: rect.height || window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      worker.terminate();
      workerRef.current = null;
    };
  }, [mounted, supportsOffscreen, isMobile, performanceConfig, reducedMotion]);

  // Update config when it changes
  useEffect(() => {
    if (!workerRef.current) return;

    workerRef.current.postMessage({
      type: "updateConfig",
      config: {
        nodeCount: performanceConfig.nodeCount,
        maxConnectionsPerNode: performanceConfig.maxConnectionsPerNode,
        connectionThreshold: performanceConfig.connectionThreshold,
        bloomEnabled: performanceConfig.enableBloom,
        bloomIntensity: performanceConfig.bloomIntensity,
        pulseSpeed: performanceConfig.pulseSpeed,
        reducedMotion,
      },
    });
  }, [performanceConfig, reducedMotion]);

  if (!mounted) {
    return <div className={`h-full w-full ${className}`} />;
  }

  // Mobile fallback or no OffscreenCanvas support
  if (isMobile || !supportsOffscreen) {
    return <FallbackBackground />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      style={{ background: "transparent" }}
    />
  );
}
