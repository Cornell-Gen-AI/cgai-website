"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface AnimatedCameraProps {
  pathRadiusX?: number;
  pathRadiusZ?: number;
  pathSpeed?: number;
  verticalAmount?: number;
}

// Linear interpolation helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function AnimatedCamera({
  pathRadiusX = 3,
  pathRadiusZ = 4,
  pathSpeed = 0.08,
  verticalAmount = 1.5,
}: AnimatedCameraProps) {
  const { camera } = useThree();
  const angle = useRef(0);
  const currentPos = useRef({ x: 0, y: 0, z: 0 });
  const currentLook = useRef({ x: 0, y: 0, z: 0 });

  // Initialize camera position
  useEffect(() => {
    camera.position.set(pathRadiusX, 0, 0);
    currentPos.current = { x: pathRadiusX, y: 0, z: 0 };
  }, [camera, pathRadiusX]);

  // Animate camera moving in elliptical path inside the brain
  useFrame((_, delta) => {
    // Frame-rate independent smoothing factor
    const smoothFactor = 1 - Math.pow(0.001, delta);
    const lookSmoothFactor = 1 - Math.pow(0.005, delta);

    // Move along elliptical path
    angle.current += pathSpeed * delta;

    // Elliptical path with very gentle vertical wave
    const targetX = Math.cos(angle.current) * pathRadiusX;
    const targetZ = Math.sin(angle.current) * pathRadiusZ;
    const targetY = Math.sin(angle.current * 0.7) * verticalAmount;

    // Ultra-smooth movement with frame-rate independent lerping
    currentPos.current.x = lerp(currentPos.current.x, targetX, smoothFactor);
    currentPos.current.y = lerp(currentPos.current.y, targetY, smoothFactor);
    currentPos.current.z = lerp(currentPos.current.z, targetZ, smoothFactor);

    camera.position.set(
      currentPos.current.x,
      currentPos.current.y,
      currentPos.current.z
    );

    // Look in the direction of movement (tangent to the ellipse)
    const lookAheadAngle = angle.current + 0.3;
    const lookX = Math.cos(lookAheadAngle) * pathRadiusX * 2.5;
    const lookZ = Math.sin(lookAheadAngle) * pathRadiusZ * 2.5;
    const lookY = Math.sin(lookAheadAngle * 0.7) * verticalAmount * 0.5;

    // Ultra-smooth look target
    currentLook.current.x = lerp(currentLook.current.x, lookX, lookSmoothFactor);
    currentLook.current.y = lerp(currentLook.current.y, lookY, lookSmoothFactor);
    currentLook.current.z = lerp(currentLook.current.z, lookZ, lookSmoothFactor);

    camera.lookAt(
      currentLook.current.x,
      currentLook.current.y,
      currentLook.current.z
    );
  });

  return null;
}
