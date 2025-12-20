"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

export const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className,
}: {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}) => {
  const [star, setStar] = useState<ShootingStar | null>(null);

  useEffect(() => {
    const createStar = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.5;
      const angle = Math.random() * 60 - 30;
      const scale = Math.random() * 1 + 0.5;
      const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
      const distance = Math.random() * 200 + 300;

      setStar({ id: Date.now(), x, y, angle, scale, speed, distance });

      setTimeout(() => setStar(null), (distance / speed) * 1000);
    };

    const interval = setInterval(
      createStar,
      Math.random() * (maxDelay - minDelay) + minDelay
    );

    return () => clearInterval(interval);
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {star && (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: star.x,
            top: star.y,
            transform: `rotate(${star.angle}deg) scale(${star.scale})`,
            width: `${starWidth}px`,
            height: `${starHeight}px`,
            animation: `shooting ${star.distance / star.speed}s linear forwards`,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${starColor}, ${trailColor}, transparent)`,
              boxShadow: `0 0 10px ${starColor}`,
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes shooting {
          to {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
