"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeNetwork } from "./useNodeNetwork";

interface ConnectionLinesProps {
  network: NodeNetwork;
  pulseSpeed?: number;
  baseOpacity?: number;
  curveSegments?: number;
  pulseSize?: number;
}

// Generate a curved path between two points with organic bend
function generateCurvedPath(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  // Add organic curve by offsetting the midpoint
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const perpendicular = new THREE.Vector3(
    -direction.y + direction.z * 0.5,
    direction.x - direction.z * 0.3,
    direction.y * 0.2
  ).normalize();
  
  // Random but consistent curve amount based on start/end positions
  const curveAmount = (Math.sin(start.x * 10 + end.z * 5) * 0.5 + 0.5) * length * 0.15;
  mid.add(perpendicular.multiplyScalar(curveAmount));

  // Create quadratic bezier curve
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  
  for (let i = 0; i <= segments; i++) {
    points.push(curve.getPoint(i / segments));
  }
  
  return points;
}

// Get connection color based on position
function getConnectionColor(start: THREE.Vector3, end: THREE.Vector3): THREE.Color {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const mixFactor = Math.sin(mid.x * 0.5 + mid.z * 0.3) * 0.5 + 0.5;
  const color1 = new THREE.Color("#5b9dff");
  const color2 = new THREE.Color("#c55bff");
  return color1.lerp(color2, mixFactor);
}

interface PulseGroup {
  curvePoints: THREE.Vector3[];
  phase: number;
  speed: number;
  color: THREE.Color;
  // Index into each of the 3 instanced meshes
  index: number;
}

export function ConnectionLines({
  network,
  pulseSpeed = 0.8,
  baseOpacity = 0.15,
  curveSegments = 8,
  pulseSize = 0.12,
}: ConnectionLinesProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulseSmallRef = useRef<THREE.Points>(null);
  const pulseMediumRef = useRef<THREE.Points>(null);
  const pulseLargeRef = useRef<THREE.Points>(null);

  // Create curved line geometry and pulse data
  const { lineGeometry, pulseData, pulseCount } = useMemo(() => {
    const linePositions: number[] = [];
    const lineOpacities: number[] = [];
    const pulses: PulseGroup[] = [];

    for (let connIdx = 0; connIdx < network.connections.length; connIdx++) {
      const [i, j] = network.connections[connIdx];
      const start = new THREE.Vector3(
        network.positions[i * 3],
        network.positions[i * 3 + 1],
        network.positions[i * 3 + 2]
      );
      const end = new THREE.Vector3(
        network.positions[j * 3],
        network.positions[j * 3 + 1],
        network.positions[j * 3 + 2]
      );

      // Generate curved path
      const curvePoints = generateCurvedPath(start, end, curveSegments);

      // Add line segments for the curve
      for (let k = 0; k < curvePoints.length - 1; k++) {
        linePositions.push(
          curvePoints[k].x, curvePoints[k].y, curvePoints[k].z,
          curvePoints[k + 1].x, curvePoints[k + 1].y, curvePoints[k + 1].z
        );
        lineOpacities.push(baseOpacity, baseOpacity);
      }

      // Only 50% of connections get pulses
      if (Math.random() < 0.5) {
        // Get color for this connection
        const connectionColor = getConnectionColor(start, end);

        // Add pulse group
        pulses.push({
          curvePoints,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4,
          color: connectionColor,
          index: pulses.length,
        });
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("opacity", new THREE.Float32BufferAttribute(lineOpacities, 1));

    return {
      lineGeometry: lineGeo,
      pulseData: pulses,
      pulseCount: pulses.length,
    };
  }, [network, baseOpacity, curveSegments]);

  // Create point geometry for each layer
  const { smallGeometry, mediumGeometry, largeGeometry } = useMemo(() => {
    const positions = new Float32Array(pulseCount * 3);
    const colors = new Float32Array(pulseCount * 3);
    
    // Initialize with pulse colors
    for (const pulse of pulseData) {
      colors[pulse.index * 3] = pulse.color.r;
      colors[pulse.index * 3 + 1] = pulse.color.g;
      colors[pulse.index * 3 + 2] = pulse.color.b;
    }
    
    const createGeometry = () => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions.slice(), 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors.slice(), 3));
      return geo;
    };
    
    return {
      smallGeometry: createGeometry(),
      mediumGeometry: createGeometry(),
      largeGeometry: createGeometry(),
    };
  }, [pulseCount, pulseData]);
  
  // Three point materials with different sizes and opacities
  // Small = most opaque, Large = least opaque  
  const pulseMaterialSmall = useMemo(() => {
    return new THREE.PointsMaterial({
      size: pulseSize * 0.5,
      transparent: true,
      opacity: 0.3,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
  }, [pulseSize]);
  
  const pulseMaterialMedium = useMemo(() => {
    return new THREE.PointsMaterial({
      size: pulseSize * 1.0,
      transparent: true,
      opacity: 0.22,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
  }, [pulseSize]);
  
  const pulseMaterialLarge = useMemo(() => {
    return new THREE.PointsMaterial({
      size: pulseSize * 1.8,
      transparent: true,
      opacity: 0.15,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
  }, [pulseSize]);

  // Line material
  const lineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor1: { value: new THREE.Color("#5b9dff") },
        uColor2: { value: new THREE.Color("#c55bff") },
      },
      vertexShader: `
        attribute float opacity;
        varying float vOpacity;
        varying vec3 vPosition;
        
        void main() {
          vOpacity = opacity;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vOpacity;
        varying vec3 vPosition;
        
        void main() {
          float mixFactor = sin(vPosition.x * 0.5 + vPosition.z * 0.3) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, mixFactor);
          gl_FragColor = vec4(color, vOpacity);
        }
      `,
    });
  }, []);

  // Animate pulses traveling along curves
  useFrame((state) => {
    if (pulseCount === 0 || pulseData.length === 0) return;
    
    const smallPositions = smallGeometry.attributes.position.array as Float32Array;
    const mediumPositions = mediumGeometry.attributes.position.array as Float32Array;
    const largePositions = largeGeometry.attributes.position.array as Float32Array;

    const time = state.clock.elapsedTime * pulseSpeed;

    for (const pulse of pulseData) {
      // Calculate position along curve (0-1, looping)
      const t = ((time * pulse.speed + pulse.phase) % (Math.PI * 2)) / (Math.PI * 2);
      
      // Get position along the curve
      const numPoints = pulse.curvePoints.length;
      const curveIndex = Math.floor(t * (numPoints - 1));
      const localT = (t * (numPoints - 1)) % 1;
      
      const p1 = pulse.curvePoints[Math.min(curveIndex, numPoints - 1)];
      const p2 = pulse.curvePoints[Math.min(curveIndex + 1, numPoints - 1)];
      
      // Interpolated position
      const posX = p1.x + (p2.x - p1.x) * localT;
      const posY = p1.y + (p2.y - p1.y) * localT;
      const posZ = p1.z + (p2.z - p1.z) * localT;
      
      // Update all three point geometries
      const idx = pulse.index * 3;
      smallPositions[idx] = posX;
      smallPositions[idx + 1] = posY;
      smallPositions[idx + 2] = posZ;
      
      mediumPositions[idx] = posX;
      mediumPositions[idx + 1] = posY;
      mediumPositions[idx + 2] = posZ;
      
      largePositions[idx] = posX;
      largePositions[idx + 1] = posY;
      largePositions[idx + 2] = posZ;
    }

    smallGeometry.attributes.position.needsUpdate = true;
    mediumGeometry.attributes.position.needsUpdate = true;
    largeGeometry.attributes.position.needsUpdate = true;
  });

  if (network.connections.length === 0) return null;

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
      {pulseCount > 0 && (
        <>
          {/* Large circle - most transparent, outermost glow */}
          <points ref={pulseLargeRef} geometry={largeGeometry} material={pulseMaterialLarge} />
          {/* Medium circle */}
          <points ref={pulseMediumRef} geometry={mediumGeometry} material={pulseMaterialMedium} />
          {/* Small circle - most opaque, innermost core */}
          <points ref={pulseSmallRef} geometry={smallGeometry} material={pulseMaterialSmall} />
        </>
      )}
    </group>
  );
}
