// Web Worker for offscreen Three.js rendering
import * as THREE from "three";

interface WorkerMessage {
  type: "init" | "resize" | "updateTime" | "updateConfig";
  canvas?: OffscreenCanvas;
  width?: number;
  height?: number;
  dpr?: number;
  time?: number;
  config?: {
    nodeCount: number;
    maxConnectionsPerNode: number;
    connectionThreshold: number;
    bloomEnabled: boolean;
    bloomIntensity: number;
    pulseSpeed: number;
    reducedMotion: boolean;
  };
}

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let animationId: number | null = null;

// Scene objects
let nodePoints: THREE.Points | null = null;
let connectionLines: THREE.LineSegments | null = null;
let pulsePoints: THREE.Points | null = null;

// Animation state
let time = 0;
let cameraAngle = 0;
let reducedMotion = false;

// Network data
interface NetworkData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
  connections: [number, number][];
  pulseStartPos: Float32Array;
  pulseEndPos: Float32Array;
  pulsePhases: Float32Array;
  pulseSpeeds: Float32Array;
  pulseColors: Float32Array;
}

let networkData: NetworkData | null = null;

// Generate node network
function generateNetwork(
  nodeCount: number,
  connectionThreshold: number,
  maxConnectionsPerNode: number
): NetworkData {
  const brainWidth = 20;
  const brainHeight = 15;
  const brainDepth = 25;

  const positions = new Float32Array(nodeCount * 3);
  const colors = new Float32Array(nodeCount * 3);
  const sizes = new Float32Array(nodeCount);
  const phases = new Float32Array(nodeCount);

  const colorPalette = [
    [0.36, 0.62, 1.0],   // #5b9dff - blue
    [0.48, 0.36, 1.0],   // #7b5bff - purple
    [0.77, 0.36, 1.0],   // #c55bff - magenta
    [1.0, 0.47, 0.73],   // #ff78ba - pink
    [0.68, 0.53, 1.0],   // #ad87ff - light purple
  ];

  // Generate nodes on perimeter
  for (let i = 0; i < nodeCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    let r = Math.random() < 0.85
      ? 0.85 + Math.random() * 0.15
      : 0.3 + Math.random() * 0.5;
    r += (Math.random() - 0.5) * 0.1;
    r = Math.max(0.2, Math.min(1.0, r));

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * brainWidth;
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * brainHeight;
    positions[i * 3 + 2] = r * Math.cos(phi) * brainDepth;

    const colorIdx = Math.floor(Math.random() * colorPalette.length);
    const color = colorPalette[colorIdx];
    colors[i * 3] = color[0];
    colors[i * 3 + 1] = color[1];
    colors[i * 3 + 2] = color[2];

    sizes[i] = r < 0.5 ? 1.2 + Math.random() * 0.5 : 0.7 + Math.random() * 0.4;
    phases[i] = Math.random() * Math.PI * 2;
  }

  // Generate connections
  const connections: [number, number][] = [];
  const connectionCounts = new Array(nodeCount).fill(0);

  for (let i = 0; i < nodeCount; i++) {
    if (connectionCounts[i] >= maxConnectionsPerNode) continue;

    for (let j = i + 1; j < nodeCount; j++) {
      if (connectionCounts[j] >= maxConnectionsPerNode) continue;

      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < connectionThreshold) {
        connections.push([i, j]);
        connectionCounts[i]++;
        connectionCounts[j]++;

        if (connectionCounts[i] >= maxConnectionsPerNode) break;
      }
    }
  }

  // Generate pulse data (30% of connections)
  const pulseConnections = connections.filter(() => Math.random() < 0.3);
  const pulseCount = pulseConnections.length;

  const pulseStartPos = new Float32Array(pulseCount * 3);
  const pulseEndPos = new Float32Array(pulseCount * 3);
  const pulsePhases = new Float32Array(pulseCount);
  const pulseSpeeds = new Float32Array(pulseCount);
  const pulseColors = new Float32Array(pulseCount * 3);

  const color1 = new THREE.Color("#5b9dff");
  const color2 = new THREE.Color("#c55bff");

  for (let p = 0; p < pulseCount; p++) {
    const [i, j] = pulseConnections[p];

    pulseStartPos[p * 3] = positions[i * 3];
    pulseStartPos[p * 3 + 1] = positions[i * 3 + 1];
    pulseStartPos[p * 3 + 2] = positions[i * 3 + 2];

    pulseEndPos[p * 3] = positions[j * 3];
    pulseEndPos[p * 3 + 1] = positions[j * 3 + 1];
    pulseEndPos[p * 3 + 2] = positions[j * 3 + 2];

    const midX = (positions[i * 3] + positions[j * 3]) / 2;
    const midZ = (positions[i * 3 + 2] + positions[j * 3 + 2]) / 2;
    const mixFactor = Math.sin(midX * 0.5 + midZ * 0.3) * 0.5 + 0.5;
    const color = color1.clone().lerp(color2, mixFactor);

    pulseColors[p * 3] = color.r;
    pulseColors[p * 3 + 1] = color.g;
    pulseColors[p * 3 + 2] = color.b;

    pulsePhases[p] = Math.random() * Math.PI * 2;
    pulseSpeeds[p] = 0.3 + Math.random() * 0.5;
  }

  return {
    positions,
    colors,
    sizes,
    phases,
    connections,
    pulseStartPos,
    pulseEndPos,
    pulsePhases,
    pulseSpeeds,
    pulseColors,
  };
}

function initScene(canvas: OffscreenCanvas, width: number, height: number, dpr: number) {
  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas as unknown as HTMLCanvasElement,
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(dpr);

  // Create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 150);
  camera.position.set(4, 0, 0);
}

function createSceneObjects(config: WorkerMessage["config"]) {
  if (!scene || !config) return;

  // Clear existing objects
  if (nodePoints) scene.remove(nodePoints);
  if (connectionLines) scene.remove(connectionLines);
  if (pulsePoints) scene.remove(pulsePoints);

  // Generate network
  networkData = generateNetwork(
    config.nodeCount,
    config.connectionThreshold,
    config.maxConnectionsPerNode
  );

  // Create node points
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(networkData.positions, 3));
  nodeGeometry.setAttribute("color", new THREE.BufferAttribute(networkData.colors, 3));

  const baseSizes = new Float32Array(networkData.sizes.length);
  for (let i = 0; i < networkData.sizes.length; i++) {
    baseSizes[i] = 0.08 * networkData.sizes[i] * 100;
  }
  nodeGeometry.setAttribute("baseSize", new THREE.BufferAttribute(baseSizes, 1));
  nodeGeometry.setAttribute("phase", new THREE.BufferAttribute(networkData.phases, 1));

  const nodeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      reducedMotion: { value: config.reducedMotion ? 1.0 : 0.0 },
    },
    vertexShader: `
      attribute float baseSize;
      attribute float phase;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float time;
      uniform float reducedMotion;
      
      void main() {
        vColor = color;
        float pulse = reducedMotion > 0.5 ? 1.0 : 0.85 + 0.15 * sin(time * 0.4 + phase);
        float finalSize = baseSize * pulse;
        
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
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
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

  nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
  scene.add(nodePoints);

  // Create connection lines
  const linePositions: number[] = [];
  const lineColors: number[] = [];
  const color1 = new THREE.Color("#5b9dff");
  const color2 = new THREE.Color("#c55bff");

  for (const [i, j] of networkData.connections) {
    linePositions.push(
      networkData.positions[i * 3],
      networkData.positions[i * 3 + 1],
      networkData.positions[i * 3 + 2],
      networkData.positions[j * 3],
      networkData.positions[j * 3 + 1],
      networkData.positions[j * 3 + 2]
    );

    const midX = (networkData.positions[i * 3] + networkData.positions[j * 3]) / 2;
    const midZ = (networkData.positions[i * 3 + 2] + networkData.positions[j * 3 + 2]) / 2;
    const mixFactor = Math.sin(midX * 0.5 + midZ * 0.3) * 0.5 + 0.5;
    const color = color1.clone().lerp(color2, mixFactor);

    lineColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.18,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(connectionLines);

  // Create pulse points
  const pulseCount = networkData.pulseStartPos.length / 3;
  if (pulseCount > 0) {
    const pulseGeometry = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    pulseGeometry.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeometry.setAttribute("startPos", new THREE.BufferAttribute(networkData.pulseStartPos, 3));
    pulseGeometry.setAttribute("endPos", new THREE.BufferAttribute(networkData.pulseEndPos, 3));
    pulseGeometry.setAttribute("color", new THREE.BufferAttribute(networkData.pulseColors, 3));
    pulseGeometry.setAttribute("phase", new THREE.BufferAttribute(networkData.pulsePhases, 1));
    pulseGeometry.setAttribute("speed", new THREE.BufferAttribute(networkData.pulseSpeeds, 1));

    const pulseMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseSpeed: { value: config.pulseSpeed || 0.5 },
        reducedMotion: { value: config.reducedMotion ? 1.0 : 0.0 },
      },
      vertexShader: `
        attribute vec3 startPos;
        attribute vec3 endPos;
        attribute float phase;
        attribute float speed;
        uniform float time;
        uniform float pulseSpeed;
        uniform float reducedMotion;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          float t = reducedMotion > 0.5 ? 0.5 : fract((time * pulseSpeed * speed + phase) / 6.28318);
          vec3 pos = mix(startPos, endPos, t);
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = -mvPosition.z;
          vAlpha = smoothstep(80.0, 5.0, dist) * 0.5;
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = 8.0 * (30.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
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

    pulsePoints = new THREE.Points(pulseGeometry, pulseMaterial);
    scene.add(pulsePoints);
  }

  reducedMotion = config.reducedMotion;
}

function animate() {
  if (!renderer || !scene || !camera) return;

  // Update camera position (orbital)
  if (!reducedMotion) {
    cameraAngle += 0.0003;
    const pathRadiusX = 4;
    const pathRadiusZ = 5;
    const verticalAmount = 2;

    camera.position.x = Math.cos(cameraAngle) * pathRadiusX;
    camera.position.z = Math.sin(cameraAngle) * pathRadiusZ;
    camera.position.y = Math.sin(cameraAngle * 0.7) * verticalAmount;

    // Look forward along path
    const lookAhead = 0.3;
    camera.lookAt(
      Math.cos(cameraAngle + lookAhead) * pathRadiusX * 0.5,
      Math.sin((cameraAngle + lookAhead) * 0.7) * verticalAmount * 0.5,
      Math.sin(cameraAngle + lookAhead) * pathRadiusZ * 0.5
    );

    time += 0.016;
  }

  // Update shader uniforms
  if (nodePoints) {
    (nodePoints.material as THREE.ShaderMaterial).uniforms.time.value = time;
  }
  if (pulsePoints) {
    (pulsePoints.material as THREE.ShaderMaterial).uniforms.time.value = time;
  }

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
}

// Handle messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, canvas, width, height, dpr, config } = event.data;

  switch (type) {
    case "init":
      if (canvas && width && height && dpr) {
        initScene(canvas, width, height, dpr);
        if (config) {
          createSceneObjects(config);
        }
        animate();
      }
      break;

    case "resize":
      if (renderer && camera && width && height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      break;

    case "updateConfig":
      if (config) {
        createSceneObjects(config);
      }
      break;

    case "updateTime":
      // Time updates handled in animation loop
      break;
  }
};

export {};
