"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeNetwork } from "./useNodeNetwork";

interface NodeCloudBillboardProps {
  network: NodeNetwork;
  pulseSpeed?: number;
  baseSize?: number;
  reducedMotion?: boolean;
}

// 2D billboard-based node rendering using Points (much faster than instanced spheres)
export function NodeCloudBillboard({ network, pulseSpeed = 1.5, baseSize = 0.08, reducedMotion = false }: NodeCloudBillboardProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Create geometry with positions and colors
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // Copy positions
    const positions = new Float32Array(network.positions);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    // Copy colors
    const colors = new Float32Array(network.colors);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    
    // Store sizes for pulsing animation
    const sizes = new Float32Array(network.count);
    for (let i = 0; i < network.count; i++) {
      sizes[i] = baseSize * network.sizes[i] * 100; // Scale for point size
    }
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    
    // Store phases for pulsing
    const phases = new Float32Array(network.phases);
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    
    // Store base sizes for reference during animation
    const baseSizes = new Float32Array(network.count);
    for (let i = 0; i < network.count; i++) {
      baseSizes[i] = baseSize * network.sizes[i] * 100;
    }
    geo.setAttribute("baseSize", new THREE.BufferAttribute(baseSizes, 1));
    
    return geo;
  }, [network, baseSize]);

  // Custom shader material for circular points with glow
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseSpeed: { value: pulseSpeed },
        reducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        attribute float baseSize;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        uniform float pulseSpeed;
        uniform float reducedMotion;
        
        void main() {
          vColor = color;
          
          // Pulsing animation (disabled if reduced motion)
          float pulse = reducedMotion > 0.5 ? 1.0 : 0.85 + 0.15 * sin(time * pulseSpeed + phase);
          float finalSize = baseSize * pulse;
          
          // Fade alpha based on distance for depth effect
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          vAlpha = smoothstep(100.0, 5.0, dist) * 0.7;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = finalSize * (50.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Create circular point with soft edge
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          // Soft circular falloff
          float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
          
          // Glow effect - brighter in center
          float glow = smoothstep(0.5, 0.0, dist) * 0.5;
          vec3 finalColor = vColor + vColor * glow;
          
          if (alpha < 0.01) discard;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }, [pulseSpeed, reducedMotion]);

  // Animate pulsing via shader uniform
  useFrame((state) => {
    if (material) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}
