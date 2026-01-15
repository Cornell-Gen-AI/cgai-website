"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeNetwork } from "./useNodeNetwork";

interface NodeCloudProps {
  network: NodeNetwork;
  pulseSpeed?: number;
  baseSize?: number;
}

export function NodeCloud({ network, pulseSpeed = 1.5, baseSize = 0.08 }: NodeCloudProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Create the geometry and material once - minimal segments for performance
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 4, 4), []);
  
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.4,
        toneMapped: true,
      }),
    []
  );

  // Initialize instance matrices and colors
  useMemo(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < network.count; i++) {
      tempObject.position.set(
        network.positions[i * 3],
        network.positions[i * 3 + 1],
        network.positions[i * 3 + 2]
      );
      tempObject.scale.setScalar(baseSize * network.sizes[i]);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      tempColor.setRGB(
        network.colors[i * 3],
        network.colors[i * 3 + 1],
        network.colors[i * 3 + 2]
      );
      meshRef.current.setColorAt(i, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [network, baseSize, tempObject, tempColor]);

  // Animate pulsing
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime * pulseSpeed;

    for (let i = 0; i < network.count; i++) {
      // Pulse scale based on phase - larger nodes pulse more subtly
      const nodeSize = network.sizes[i];
      const pulseAmount = 0.15 / nodeSize; // Smaller pulse for larger nodes
      const pulse = 1 - pulseAmount + pulseAmount * 2 * Math.sin(time + network.phases[i]);
      const scale = baseSize * nodeSize * pulse;

      tempObject.position.set(
        network.positions[i * 3],
        network.positions[i * 3 + 1],
        network.positions[i * 3 + 2]
      );
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, network.count]}
      frustumCulled={false}
    />
  );
}
