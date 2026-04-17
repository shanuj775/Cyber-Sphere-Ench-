"use client";

import { useMemo } from "react";

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

export function SandParticles() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 42 }, (_, id) => ({
        id,
        left: (id * 17) % 100,
        top: (id * 29) % 100,
        size: 1 + ((id * 7) % 4),
        duration: 14 + (id % 7) * 3,
        delay: (id % 9) * 0.8,
        drift: ((id % 5) - 2) * 18,
        opacity: 0.16 + (id % 4) * 0.08,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="sand-particle"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              "--drift": `${particle.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
