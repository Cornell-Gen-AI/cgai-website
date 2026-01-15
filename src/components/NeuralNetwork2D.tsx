"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  depth: number; // 0-1, affects parallax speed and opacity
  phase: number;
  driftSpeed: number;
  driftAngle: number;
  color: string;
}

interface Connection {
  from: number;
  to: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface Pulse {
  connectionIndex: number;
  progress: number;
  speed: number;
}

const COLORS = [
  "rgba(91, 157, 255, 1)",   // #5b9dff - blue
  "rgba(123, 91, 255, 1)",   // #7b5bff - purple  
  "rgba(197, 91, 255, 1)",   // #c55bff - magenta
  "rgba(255, 120, 186, 1)",  // #ff78ba - pink
  "rgba(173, 135, 255, 1)",  // #ad87ff - light purple
];

function getColorWithAlpha(color: string, alpha: number): string {
  return color.replace(/[\d.]+\)$/, `${alpha})`);
}

export interface NeuralNetwork2DProps {
  className?: string;
  nodeCount?: number;
  connectionDensity?: number;
}

export function NeuralNetwork2D({ 
  className = "", 
  nodeCount = 80,
  connectionDensity = 0.15 
}: NeuralNetwork2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Initialize nodes and connections
  const initializeNetwork = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    // Create nodes distributed across the canvas with depth layers
    for (let i = 0; i < nodeCount; i++) {
      const depth = Math.random(); // 0 = far (small, slow), 1 = close (large, fast)
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: 2 + depth * 4, // 2-6px based on depth
        depth,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.2 + Math.random() * 0.3,
        driftAngle: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    // Create connections between nearby nodes (prefer same depth layer)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const depthDiff = Math.abs(nodes[i].depth - nodes[j].depth);
        
        // Connect if close enough and similar depth
        const maxDist = 150 + (1 - depthDiff) * 100;
        if (dist < maxDist && Math.random() < connectionDensity) {
          connections.push({
            from: i,
            to: j,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.3 + Math.random() * 0.4,
          });
        }
      }
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;

    // Initialize some traveling pulses (30% of connections)
    const pulses: Pulse[] = [];
    connections.forEach((_, idx) => {
      if (Math.random() < 0.3) {
        pulses.push({
          connectionIndex: idx,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
        });
      }
    });
    pulsesRef.current = pulses;

    console.log(`[2D Background] Initialized: ${nodes.length} nodes, ${connections.length} connections, ${pulses.length} pulses`);
  }, [nodeCount, connectionDensity]);

  // Animation loop
  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const nodes = nodesRef.current;
    const connections = connectionsRef.current;
    const pulses = pulsesRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update node positions (organic drift)
    if (!reducedMotion) {
      nodes.forEach((node) => {
        // Gentle drift based on depth (parallax effect)
        const driftAmount = 15 + node.depth * 25; // Far nodes drift less
        const drift = Math.sin(time * node.driftSpeed + node.phase) * driftAmount;
        const driftY = Math.cos(time * node.driftSpeed * 0.7 + node.phase) * driftAmount * 0.6;
        
        node.x = node.baseX + Math.cos(node.driftAngle) * drift;
        node.y = node.baseY + Math.sin(node.driftAngle) * driftY;
      });
    }

    // Sort by depth for proper layering (far nodes first)
    const sortedIndices = nodes
      .map((_, i) => i)
      .sort((a, b) => nodes[a].depth - nodes[b].depth);

    // Draw connections (lines between nodes)
    connections.forEach((conn) => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      const avgDepth = (fromNode.depth + toNode.depth) / 2;
      
      // Line opacity based on depth
      const baseAlpha = 0.08 + avgDepth * 0.12;
      
      // Gradient line
      const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
      gradient.addColorStop(0, getColorWithAlpha(fromNode.color, baseAlpha));
      gradient.addColorStop(1, getColorWithAlpha(toNode.color, baseAlpha));
      
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5 + avgDepth * 1;
      ctx.stroke();
    });

    // Draw traveling pulses
    if (!reducedMotion) {
      pulses.forEach((pulse) => {
        const conn = connections[pulse.connectionIndex];
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        
        // Update progress
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;
        
        // Calculate pulse position
        const x = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;
        const avgDepth = (fromNode.depth + toNode.depth) / 2;
        
        // Draw pulse glow (multiple layers)
        const pulseSize = 3 + avgDepth * 4;
        const color = fromNode.color;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = getColorWithAlpha(color, 0.1);
        ctx.fill();
        
        // Middle glow
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = getColorWithAlpha(color, 0.2);
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = getColorWithAlpha(color, 0.5);
        ctx.fill();
      });
    }

    // Draw nodes (sorted by depth)
    sortedIndices.forEach((i) => {
      const node = nodes[i];
      
      // Pulsing size
      const pulseScale = reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(time * 2 + node.phase);
      const size = node.size * pulseScale;
      
      // Alpha based on depth
      const alpha = 0.3 + node.depth * 0.5;
      
      // Draw glow
      const glowSize = size * 3;
      const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
      glowGradient.addColorStop(0, getColorWithAlpha(node.color, alpha * 0.4));
      glowGradient.addColorStop(0.5, getColorWithAlpha(node.color, alpha * 0.1));
      glowGradient.addColorStop(1, getColorWithAlpha(node.color, 0));
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
      
      // Draw core
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx.fillStyle = getColorWithAlpha(node.color, alpha);
      ctx.fill();
    });
  }, [reducedMotion]);

  // Setup and resize handling
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Reinitialize network on resize
      initializeNetwork(rect.width, rect.height);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Animation loop
    let startTime = performance.now();
    const loop = () => {
      const time = (performance.now() - startTime) / 1000;
      const rect = canvas.getBoundingClientRect();
      animate(ctx, rect.width, rect.height, time);
      animationRef.current = requestAnimationFrame(loop);
    };

    if (!reducedMotion) {
      loop();
    } else {
      // Single frame for reduced motion
      animate(ctx, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height, 0);
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, animate, initializeNetwork, reducedMotion]);

  if (!mounted) {
    return <div className={`h-full w-full ${className}`} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      style={{ background: "transparent" }}
    />
  );
}
