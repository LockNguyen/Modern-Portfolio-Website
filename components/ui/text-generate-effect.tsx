"use client";

import { motion, stagger, useAnimate } from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  startGalaxyColorIndex,
  endGalaxyColorIndex
}: {
  words: string;
  className?: string;
  startGalaxyColorIndex?: number;
  endGalaxyColorIndex?: number;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              data-text={word}
              className={cn("text-white opacity-0", (startGalaxyColorIndex != null && endGalaxyColorIndex != null && idx >= startGalaxyColorIndex && idx <= endGalaxyColorIndex) && "text-galaxy")}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="leading-snug tracking-wide text-black dark:text-white">
        {renderWords()}
      </div>
    </div>
  );
};
