"use client"

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  'rgba(0,212,255,',
  'rgba(0,180,255,',
  'rgba(0,255,255,',
  'rgba(0,150,255,',
  'rgba(100,220,255,',
];

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    const spawnParticle = (): Particle => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (side === 0) { x = Math.random() * canvas.width; y = canvas.height + 10; }
      else if (side === 1) { x = -10; y = Math.random() * canvas.height; }
      else if (side === 2) { x = canvas.width + 10; y = Math.random() * canvas.height; }
      else { x = Math.random() * canvas.width; y = -10; }

      const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x) + (Math.random() - 0.5) * 1.5;
      const speed = 0.15 + Math.random() * 0.4;
      const life = 120 + Math.random() * 200;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 0.8 + Math.random() * 1.8,
        opacity: 0,
        maxOpacity: 0.3 + Math.random() * 0.5,
        life,
        maxLife: life,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    // Pre-spawn
    for (let i = 0; i < 80; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      p.opacity = p.maxOpacity * (p.life / p.maxLife);
      particlesRef.current.push(p);
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Spawn new particles
      while (particlesRef.current.length < 120) {
        particlesRef.current.push(spawnParticle());
      }

      const mouse = mouseRef.current;

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.life--;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.3;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen
        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out
        const lifeFrac = p.life / p.maxLife;
        p.opacity = lifeFrac < 0.1 ? p.maxOpacity * (lifeFrac / 0.1)
          : lifeFrac > 0.9 ? p.maxOpacity * ((1 - lifeFrac) / 0.1)
          : p.maxOpacity;

        // Glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `${p.color}${p.opacity})`);
        grad.addColorStop(1, `${p.color}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(1, p.opacity * 2)})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 90) {
            const alpha = (1 - d / 90) * 0.07;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
