'use client';

import { useEffect, useRef } from 'react';

interface Circle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;
}

interface AnimatedCirclesBackgroundProps {
  children: React.ReactNode;
}

export default function AnimatedCirclesBackground({ children }: AnimatedCirclesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colors = ['#71A3FF', '#957F00', '#6C93FF', '#00EFFF', '#F0F0F0', '#000000'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const circleCount = Math.floor(Math.random() * 4) + 5;
    const circles: Circle[] = Array.from({ length: circleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 40 + 20,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const circle of circles) {
        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
          circle.dx *= -1;
        }
        if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0) {
          circle.dy *= -1;
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.shadowBlur = 40;
        ctx.shadowColor = circle.color;
        ctx.fillStyle = `${circle.color}50`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}