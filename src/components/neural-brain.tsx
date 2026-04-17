"use client"

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

interface Signal {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  id: number;
  color: string;
}

const BRAIN_NODES: { x: number; y: number; r: number }[] = [
  // Cortex top
  { x: 250, y: 80, r: 6 },
  { x: 310, y: 65, r: 5 },
  { x: 370, y: 75, r: 7 },
  { x: 430, y: 70, r: 5 },
  { x: 490, y: 82, r: 6 },
  // Upper mid
  { x: 210, y: 130, r: 5 },
  { x: 280, y: 120, r: 8 },
  { x: 360, y: 110, r: 6 },
  { x: 440, y: 118, r: 7 },
  { x: 510, y: 130, r: 5 },
  { x: 570, y: 145, r: 6 },
  // Mid band
  { x: 175, y: 185, r: 5 },
  { x: 245, y: 175, r: 6 },
  { x: 320, y: 165, r: 9 },
  { x: 400, y: 160, r: 8 },
  { x: 475, y: 168, r: 6 },
  { x: 545, y: 178, r: 7 },
  { x: 605, y: 195, r: 5 },
  // Center band (widest)
  { x: 160, y: 245, r: 5 },
  { x: 225, y: 232, r: 7 },
  { x: 300, y: 220, r: 8 },
  { x: 375, y: 215, r: 10 },
  { x: 450, y: 218, r: 9 },
  { x: 525, y: 228, r: 7 },
  { x: 595, y: 240, r: 6 },
  { x: 645, y: 255, r: 5 },
  // Lower mid
  { x: 175, y: 300, r: 5 },
  { x: 245, y: 285, r: 6 },
  { x: 320, y: 273, r: 8 },
  { x: 395, y: 270, r: 9 },
  { x: 465, y: 275, r: 7 },
  { x: 535, y: 288, r: 6 },
  { x: 600, y: 302, r: 5 },
  // Lower
  { x: 210, y: 350, r: 5 },
  { x: 285, y: 335, r: 7 },
  { x: 360, y: 325, r: 8 },
  { x: 435, y: 328, r: 7 },
  { x: 505, y: 340, r: 6 },
  { x: 565, y: 355, r: 5 },
  // Bottom
  { x: 260, y: 398, r: 5 },
  { x: 330, y: 388, r: 6 },
  { x: 405, y: 385, r: 7 },
  { x: 475, y: 392, r: 5 },
  // Cerebellum  
  { x: 335, y: 435, r: 5 },
  { x: 395, y: 440, r: 6 },
  { x: 455, y: 432, r: 5 },
  // Brain stem
  { x: 375, y: 475, r: 4 },
  { x: 395, y: 490, r: 4 },
  { x: 410, y: 505, r: 3 },
];

// Connections (pairs of node indices)
const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[1,6],[2,7],[3,8],[4,9],[4,10],
  [5,11],[6,12],[7,13],[8,14],[9,15],[10,16],[10,17],
  [11,18],[12,19],[13,20],[14,21],[15,22],[16,23],[17,24],[17,25],
  [18,26],[19,27],[20,28],[21,29],[22,30],[23,31],[24,32],
  [26,33],[27,34],[28,35],[29,36],[30,37],[31,38],
  [33,39],[34,40],[35,41],[36,42],[37,43],
  [39,44],[40,44],[41,45],[42,45],[43,46],
  [44,47],[45,47],[46,47],
  [47,48],[48,49],
  // Cross connections
  [6,13],[13,21],[21,29],[29,36],[7,14],[14,22],[22,30],
  [1,7],[2,8],[8,15],[15,22],[3,9],[9,16],
  [20,28],[28,35],[35,41],[13,20],[14,21],
  [19,20],[20,21],[21,22],[27,28],[28,29],[29,30],
];

const NEON_COLORS = ['#00d4ff', '#00ffff', '#00aaff', '#0077ff', '#33ddff'];

let signalCounter = 0;

export function NeuralBrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const signalsRef = useRef<Signal[]>([]);
  const nodesRef = useRef<Node[]>(BRAIN_NODES.map(n => ({
    ...n,
    phase: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 1.5,
  })));
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Spawn signals periodically
    const spawnSignal = () => {
      const conn = CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
      const from = BRAIN_NODES[conn[0]];
      const to = BRAIN_NODES[conn[1]];
      // Sometimes reverse
      const reversed = Math.random() > 0.5;
      signalsRef.current.push({
        fromX: reversed ? to.x : from.x,
        fromY: reversed ? to.y : from.y,
        toX: reversed ? from.x : to.x,
        toY: reversed ? from.y : to.y,
        progress: 0,
        speed: 0.008 + Math.random() * 0.018,
        id: signalCounter++,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      });
    };

    const spawnInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) spawnSignal();
    }, 120);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      timeRef.current += 0.016;
      const t = timeRef.current;

      // ─── Draw connections ───
      CONNECTIONS.forEach(([ai, bi]) => {
        const a = BRAIN_NODES[ai];
        const b = BRAIN_NODES[bi];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const opacity = 0.06 + 0.04 * Math.sin(t * 0.5 + ai * 0.3);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,212,255,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // ─── Draw signals ───
      signalsRef.current = signalsRef.current.filter(sig => sig.progress <= 1);
      signalsRef.current.forEach(sig => {
        sig.progress += sig.speed;
        const px = sig.fromX + (sig.toX - sig.fromX) * sig.progress;
        const py = sig.fromY + (sig.toY - sig.fromY) * sig.progress;
        const alpha = sig.progress < 0.1 ? sig.progress * 10
          : sig.progress > 0.9 ? (1 - sig.progress) * 10 : 1;

        // Glow trail
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, sig.color.replace(')', `,${alpha})`).replace('rgb', 'rgba'));
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.fill();
      });

      // ─── Draw nodes ───
      nodesRef.current.forEach((node, i) => {
        const pulse = Math.sin(t * node.speed + node.phase);
        const r = node.r + pulse * 1.5;
        const glow = 0.4 + 0.6 * ((pulse + 1) / 2);

        // Outer glow
        const outerGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3.5);
        outerGrad.addColorStop(0, `rgba(0,212,255,${glow * 0.3})`);
        outerGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Node body
        const nodeGrad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
        nodeGrad.addColorStop(0, `rgba(180,240,255,${glow})`);
        nodeGrad.addColorStop(0.5, `rgba(0,212,255,${glow * 0.9})`);
        nodeGrad.addColorStop(1, `rgba(0,100,180,${glow * 0.5})`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(node.x - r * 0.2, node.y - r * 0.2, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${glow * 0.7})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(spawnInterval);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Outer atmospheric glow */}
      <div className="absolute inset-0 rounded-full" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.08) 0%, transparent 70%)',
        filter: 'blur(30px)',
      }} />
      <canvas
        ref={canvasRef}
        width={810}
        height={560}
        className="w-full max-w-[810px] h-auto"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.4))',
          animation: 'brain-breathe 4s ease-in-out infinite',
        }}
      />
      {/* Labels */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.4em]">
        Neural Cortex Active
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-[0.3em]">
          {BRAIN_NODES.length} Nodes · {CONNECTIONS.length} Synapses
        </span>
      </div>
    </div>
  );
}
