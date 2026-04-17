"use client"

import { useEffect, useRef } from 'react';

export function NeonCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const trailPosRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const clickingRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onDown = () => {
      clickingRef.current = true;
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderColor = '#fff';
      cursor.style.boxShadow = '0 0 20px #00d4ff, 0 0 40px rgba(0,212,255,0.5)';
    };
    const onUp = () => {
      clickingRef.current = false;
      cursor.style.width = '14px';
      cursor.style.height = '14px';
      cursor.style.borderColor = '#00d4ff';
      cursor.style.boxShadow = '0 0 8px #00d4ff';
    };

    const smoothTrail = () => {
      trailPosRef.current.x += (posRef.current.x - trailPosRef.current.x) * 0.12;
      trailPosRef.current.y += (posRef.current.y - trailPosRef.current.y) * 0.12;
      trail.style.left = `${trailPosRef.current.x}px`;
      trail.style.top = `${trailPosRef.current.y}px`;
      animRef.current = requestAnimationFrame(smoothTrail);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    animRef.current = requestAnimationFrame(smoothTrail);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '14px', height: '14px',
          border: '2px solid #00d4ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%,-50%)',
          transition: 'width 0.15s, height 0.15s, border-color 0.15s, box-shadow 0.15s',
          boxShadow: '0 0 8px #00d4ff',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={trailRef}
        style={{
          position: 'fixed',
          width: '5px', height: '5px',
          background: '#00d4ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%,-50%)',
          boxShadow: '0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.4)',
          opacity: 0.7,
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}
