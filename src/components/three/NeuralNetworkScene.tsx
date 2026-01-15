"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNodeNetwork } from "./useNodeNetwork";
import { NodeCloud } from "./NodeCloud";
import { ConnectionLines } from "./ConnectionLines";
import { AnimatedCamera } from "./AnimatedCamera";

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
function Scene() {
  const network = useNodeNetwork({
    nodeCount: 400,
    brainWidth: 20,
    brainHeight: 15,
    brainDepth: 25,
    connectionThreshold: 9,
    maxConnectionsPerNode: 4,
  });

  return (
    <>
      <AnimatedCamera
        pathRadiusX={4}
        pathRadiusZ={5}
        pathSpeed={0.06}
        verticalAmount={2}
      />
      
      <NodeCloud network={network} pulseSpeed={0.4} baseSize={0.08} />
      <ConnectionLines network={network} pulseSpeed={0.5} baseOpacity={0.18} curveSegments={4} pulseSize={0.08} />

      {/* Post-processing for subtle organic glow - simplified for performance */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export interface NeuralNetworkSceneProps {
  className?: string;
}

export function NeuralNetworkScene({ className = "" }: NeuralNetworkSceneProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing during SSR to prevent hydration mismatch
  if (!mounted) {
    return <div className={`h-full w-full ${className}`} />;
  }

  // Mobile fallback
  if (isMobile) {
    return <FallbackBackground />;
  }

  // Desktop 3D scene
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        dpr={1}
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
        frameloop="always"
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
