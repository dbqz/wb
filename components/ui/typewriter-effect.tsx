"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypewriterEffect = ({
  words,
  className,
  speed = 100,
}: {
  words: string;
  className?: string;
  speed?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, words, speed]);

  return (
    <div className={cn("font-normal text-left", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white leading-snug tracking-wide text-left"
      >
        {displayedText}
        {currentIndex < words.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[2px] h-[1em] bg-white ml-1 align-middle"
          />
        )}
      </motion.div>
    </div>
  );
};
