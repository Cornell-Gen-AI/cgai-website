"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeNetwork } from "./useNodeNetwork";

interface ConnectionLinesOptimizedProps {
  network: NodeNetwork;
  pulseSpeed?: number;
  baseOpacity?: number;
  pulseSize?: number;
  reducedMotion?: boolean;
  pulsePercentage?: number;
}

// Optimized connection lines using straight LineSegments + GPU-animated pulses
export function ConnectionLinesOptimized({
  network,
  pulseSpeed = 0.8,
  baseOpacity = 0.15,
  pulseSize = 0.12,
  reducedMotion = false,
  pulsePercentage = 0.3, // Only 30% of connections have pulses
}: ConnectionLinesOptimizedProps) {
  const pulsesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  // Create line geometry - straight lines for performance
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    const color1 = new THREE.Color("#5b9dff");
    const color2 = new THREE.Color("#c55bff");

    for (const [i, j] of network.connections) {
      // Start point
      positions.push(
        network.positions[i * 3],
        network.positions[i * 3 + 1],
        network.positions[i * 3 + 2]
      );
      // End point
      positions.push(
        network.positions[j * 3],
        network.positions[j * 3 + 1],
        network.positions[j * 3 + 2]
      );

      // Color gradient based on position
      const midX = (network.positions[i * 3] + network.positions[j * 3]) / 2;
      const midZ = (network.positions[i * 3 + 2] + network.positions[j * 3 + 2]) / 2;
      const mixFactor = Math.sin(midX * 0.5 + midZ * 0.3) * 0.5 + 0.5;
      const color = color1.clone().lerp(color2, mixFactor);

      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [network]);

  // Line material
  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      transparent: true,
      opacity: baseOpacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [baseOpacity]);

  // Create pulse geometry with GPU-animated shader
  const { pulseGeometry, pulseCount } = useMemo(() => {
    const pulseConnections: number[] = [];
    
    // Select subset of connections for pulses
    for (let i = 0; i < network.connections.length; i++) {
      if (Math.random() < pulsePercentage) {
        pulseConnections.push(i);
      }
    }

    const count = pulseConnections.length;
    const positions = new Float32Array(count * 3);
    const startPos = new Float32Array(count * 3);
    const endPos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    const color1 = new THREE.Color("#5b9dff");
    const color2 = new THREE.Color("#c55bff");

    for (let p = 0; p < count; p++) {
      const connIdx = pulseConnections[p];
      const [i, j] = network.connections[connIdx];

      // Start position
      startPos[p * 3] = network.positions[i * 3];
      startPos[p * 3 + 1] = network.positions[i * 3 + 1];
      startPos[p * 3 + 2] = network.positions[i * 3 + 2];

      // End position
      endPos[p * 3] = network.positions[j * 3];
      endPos[p * 3 + 1] = network.positions[j * 3 + 1];
      endPos[p * 3 + 2] = network.positions[j * 3 + 2];

      // Initial position at start
      positions[p * 3] = startPos[p * 3];
      positions[p * 3 + 1] = startPos[p * 3 + 1];
      positions[p * 3 + 2] = startPos[p * 3 + 2];

      // Color based on connection position
      const midX = (startPos[p * 3] + endPos[p * 3]) / 2;
      const midZ = (startPos[p * 3 + 2] + endPos[p * 3 + 2]) / 2;
      const mixFactor = Math.sin(midX * 0.5 + midZ * 0.3) * 0.5 + 0.5;
      const color = color1.clone().lerp(color2, mixFactor);
      colors[p * 3] = color.r;
      colors[p * 3 + 1] = color.g;
      colors[p * 3 + 2] = color.b;

      // Random phase and speed for variety
      phases[p] = Math.random() * Math.PI * 2;
      speeds[p] = 0.3 + Math.random() * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("startPos", new THREE.BufferAttribute(startPos, 3));
    geo.setAttribute("endPos", new THREE.BufferAttribute(endPos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));

    return { pulseGeometry: geo, pulseCount: count };
  }, [network, pulsePercentage]);

  // GPU-animated pulse material
  const pulseMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseSpeed: { value: pulseSpeed },
        pointSize: { value: pulseSize * 100 },
        reducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
      },
      vertexShader: `
        attribute vec3 startPos;
        attribute vec3 endPos;
        attribute float phase;
        attribute float speed;
        
        uniform float time;
        uniform float pulseSpeed;
        uniform float pointSize;
        uniform float reducedMotion;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Calculate t (0-1) along the connection
          float t;
          if (reducedMotion > 0.5) {
            // Static position at 50% for reduced motion
            t = 0.5;
          } else {
            // Animated position
            t = fract((time * pulseSpeed * speed + phase) / 6.28318);
          }
          
          // Interpolate position along connection
          vec3 pos = mix(startPos, endPos, t);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Fade based on distance
          float dist = -mvPosition.z;
          vAlpha = smoothstep(80.0, 5.0, dist) * 0.5;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = pointSize * (30.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Circular point with soft glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          // Soft circular falloff with glow
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
          float glow = smoothstep(0.5, 0.0, dist) * 0.3;
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
  }, [pulseSpeed, pulseSize, reducedMotion]);

  // Update time uniform (minimal CPU work)
  useFrame((state, delta) => {
    if (pulseMaterial && !reducedMotion) {
      timeRef.current += delta;
      pulseMaterial.uniforms.time.value = timeRef.current;
    }
  });

  if (network.connections.length === 0) return null;

  return (
    <group>
      <lineSegments geometry={lineGeometry} material={lineMaterial} />
      {pulseCount > 0 && (
        <points ref={pulsesRef} geometry={pulseGeometry} material={pulseMaterial} />
      )}
    </group>
  );
}
