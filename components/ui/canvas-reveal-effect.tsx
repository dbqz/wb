"use client";
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      color: number[];
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createDots = () => {
      dots = [];
      const rows = Math.floor(canvas.height / (dotSize * 3));
      const cols = Math.floor(canvas.width / (dotSize * 3));

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          dots.push({
            x: j * (dotSize * 3) + dotSize,
            y: i * (dotSize * 3) + dotSize,
            radius: dotSize,
            opacity: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    };

    createDots();

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot, index) => {
        const delay = index * animationSpeed;
        if (frame > delay) {
          const progress = Math.min((frame - delay) / 50, 1);
          dot.opacity = opacities[Math.floor(progress * opacities.length)] || 1;

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]}, ${dot.opacity})`;
          ctx.fill();
        }
      });

      frame++;
      if (frame < dots.length * animationSpeed + 50) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    setIsAnimating(true);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationSpeed, colors, dotSize, opacities]);

  return (
    <div className={cn("h-full relative bg-black", containerClassName)}>
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
      )}
    </div>
  );
};

export const Card = ({
  title,
  icon,
  children,
  description,
  showIcon = true,
}: {
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  description?: string | React.ReactNode;
  showIcon?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem] relative"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          {showIcon && icon}
        </div>
        <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
        <p className="text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10 mt-4 group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {description}
        </p>
      </div>
    </div>
  );
};

const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
