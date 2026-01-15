"use client";

import { useMemo } from "react";
import * as THREE from "three";

export interface NodeNetwork {
  positions: Float32Array;
  colors: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
  connections: Array<[number, number]>;
  count: number;
}

interface UseNodeNetworkOptions {
  nodeCount?: number;
  brainWidth?: number;
  brainHeight?: number;
  brainDepth?: number;
  connectionThreshold?: number;
  maxConnectionsPerNode?: number;
}

// Color palette - purple, magenta, blue, pink scheme
const COLORS = [
  new THREE.Color("#7b5bff"), // Purple
  new THREE.Color("#c55bff"), // Magenta
  new THREE.Color("#5b9dff"), // Blue
  new THREE.Color("#ff5bc5"), // Pink
  new THREE.Color("#ff7bd9"), // Light pink
  new THREE.Color("#9b5bff"), // Deep purple
];

export function useNodeNetwork(options: UseNodeNetworkOptions = {}): NodeNetwork {
  const {
    nodeCount = 80,
    brainWidth = 8,
    brainHeight = 6,
    brainDepth = 10,
    connectionThreshold = 4,
    maxConnectionsPerNode = 5,
  } = options;

  return useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const phases = new Float32Array(nodeCount);
    const sizes = new Float32Array(nodeCount);

    // Generate nodes mostly on a shell/perimeter with few toward center
    for (let i = 0; i < nodeCount; i++) {
      // Spherical coordinates for direction
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      // Bias radius toward the outer shell (0.85-1.0) with few nodes inside
      // 85% of nodes on outer shell, 15% scattered toward center
      let r: number;
      if (Math.random() < 0.85) {
        // Outer shell with small noise
        r = 0.85 + Math.random() * 0.15;
      } else {
        // Inner nodes - scattered toward center
        r = 0.3 + Math.random() * 0.5;
      }
      
      // Add noise to the radius for organic feel
      r += (Math.random() - 0.5) * 0.1;
      r = Math.max(0.2, Math.min(1.0, r)); // Clamp
      
      // Ellipsoid coordinates
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * brainWidth;
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * brainHeight;
      positions[i * 3 + 2] = r * Math.cos(phi) * brainDepth;

      // Inner nodes are slightly larger (hub nodes)
      const isInner = r < 0.7;
      sizes[i] = isInner ? 1.2 + Math.random() * 0.6 : 0.7 + Math.random() * 0.5;

      // Random color from palette
      const colorIndex = Math.floor(Math.random() * COLORS.length);
      const color = COLORS[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random phase for pulsing animation
      phases[i] = Math.random() * Math.PI * 2;
    }

    // Generate connections between nearby nodes
    const connections: Array<[number, number]> = [];
    const connectionCounts = new Array(nodeCount).fill(0);

    for (let i = 0; i < nodeCount; i++) {
      if (connectionCounts[i] >= maxConnectionsPerNode) continue;

      for (let j = i + 1; j < nodeCount; j++) {
        if (connectionCounts[j] >= maxConnectionsPerNode) continue;

        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < connectionThreshold) {
          // Add some randomness to avoid too many connections
          if (Math.random() < 0.6) {
            connections.push([i, j]);
            connectionCounts[i]++;
            connectionCounts[j]++;
          }
        }
      }
    }

    return {
      positions,
      colors,
      phases,
      sizes,
      connections,
      count: nodeCount,
    };
  }, [nodeCount, brainWidth, brainHeight, brainDepth, connectionThreshold, maxConnectionsPerNode]);
}
