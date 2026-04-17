"use client"

import dynamic from 'next/dynamic';
import {CSSProperties, useEffect, useState} from 'react';

const Dither = dynamic(() => import('@/components/dither'), {
  ssr: false,
  loading: () => <div className="h-full w-full dither-fallback" />,
});

export function DitherBackground() {
  const [isReady, setIsReady] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 50, y: 35});

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsReady(true), 250);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setMousePosition({
        x: Math.round((event.clientX / window.innerWidth) * 100),
        y: Math.round((event.clientY / window.innerHeight) * 100),
      });
    };

    window.addEventListener('pointermove', handlePointerMove, {passive: true});
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const style = {
    '--dither-mouse-x': `${mousePosition.x}%`,
    '--dither-mouse-y': `${mousePosition.y}%`,
  } as CSSProperties;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" style={style}>
      <div className="absolute inset-0 dither-fallback" />
      <div className="absolute inset-[-12%] dither-orbit" />
      <div className="absolute inset-0 dither-scan" />
      {isReady && (
        <div className="absolute inset-0 opacity-95 mix-blend-screen">
          <Dither
            waveColor={[0, 0.55, 1]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.65}
            colorNum={6}
            pixelSize={3}
            waveAmplitude={0.62}
            waveFrequency={2.25}
            waveSpeed={0.14}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.28)_70%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}
