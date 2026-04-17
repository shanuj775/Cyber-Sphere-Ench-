"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function OrbField({
  pointer,
  exploded,
}: {
  pointer: { x: number; y: number };
  exploded: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particleRefs = useRef<Array<THREE.Mesh | null>>([]);
  const burstRef = useRef(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => {
        const angle = (index / 90) * Math.PI * 2;
        const radius = 1.7 + ((index * 13) % 11) * 0.08;
        const height = (((index * 17) % 21) - 10) * 0.08;
        return {
          angle,
          radius,
          height,
          position: [
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          scale: 0.018 + (index % 4) * 0.008,
        };
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    burstRef.current = THREE.MathUtils.lerp(
      burstRef.current,
      exploded ? 1 : 0,
      exploded ? 0.08 : 0.05
    );
    const burst = burstRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2 + pointer.x * 0.25;
      groupRef.current.rotation.x = pointer.y * 0.12 + burst * 0.15;
    }

    if (shellRef.current) {
      shellRef.current.rotation.x = t * 0.32;
      shellRef.current.rotation.z = t * 0.18;
      shellRef.current.position.x = pointer.x * 0.24;
      shellRef.current.position.y = pointer.y * 0.16;
      const shellScale = 1 + burst * 0.5;
      shellRef.current.scale.setScalar(shellScale);
    }

    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 1.6) * 0.08 - burst * 0.22;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.position.x = pointer.x * 0.15;
      coreRef.current.position.y = pointer.y * 0.1;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y = -t * 0.34;
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.18;
      ringRef.current.scale.setScalar(1 + burst * 0.85);
    }

    particleRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const particle = particles[index];
      const burstRadius = particle.radius + burst * (1.2 + (index % 5) * 0.18);
      const burstHeight = particle.height * (1 + burst * 0.6);
      mesh.position.set(
        Math.cos(particle.angle + burst * 0.35) * burstRadius,
        burstHeight,
        Math.sin(particle.angle + burst * 0.35) * burstRadius
      );
      const scale = particle.scale + burst * 0.02;
      mesh.scale.setScalar(scale / particle.scale);
    });
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={24} color="#38bdf8" />
      <pointLight position={[-4, -2, -3]} intensity={18} color="#818cf8" />
      <pointLight position={[0, 0, 4]} intensity={12} color="#67e8f9" />

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#1d4ed8"
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.72}
          wireframe
        />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.68, 4]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#38bdf8"
          emissiveIntensity={1.8}
          roughness={0.12}
          metalness={0.4}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[0.6, 0, 0.25]}>
        <torusGeometry args={[1.95, 0.04, 16, 160]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#6366f1"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {particles.map((particle, index) => (
        <mesh
          key={index}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
          position={particle.position}
        >
          <sphereGeometry args={[particle.scale, 12, 12]} />
          <meshBasicMaterial
            color={index % 3 === 0 ? "#67e8f9" : index % 3 === 1 ? "#60a5fa" : "#a78bfa"}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroOrbScene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      setExploded(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setExploded(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isHovering]);

  return (
    <div
      className="relative h-[420px] w-full min-w-0 lg:h-[560px]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        setPointer({ x, y });
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setPointer({ x: 0, y: 0 });
        setIsHovering(false);
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_42%)] blur-2xl" />
      <Canvas camera={{ position: [0, 0, 5.8], fov: 42 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={["#020617", 5.2, 10]} />
        <OrbField pointer={pointer} exploded={exploded} />
      </Canvas>
    </div>
  );
}
