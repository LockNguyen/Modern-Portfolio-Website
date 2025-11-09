"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import "@/app/globals.css";

import { navItems } from "@/data";
import { cn } from "@/lib/utils";

type FloatingNavProps = {
  navItems: typeof navItems;
  className?: string;
};

export const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      if (current > lastScrollY) {
          setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      setLastScrollY(current);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{
          opacity: 1,
          y: 5,
          filter: "none",
        }}
        animate={{
          y: visible ? 0 : 5,
          opacity: visible ? 1 : 0,
          filter: visible? "none" : "blur(5px)",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={cn(
          "fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full bg-black-100 px-10 py-4 backdrop-blur-lg bg-transparent saturate-150 lighting-glass",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-1 text-neutral-600 hover:text-blue-700 dark:text-neutral-50 dark:hover:text-galaxy"
            )}
          >
            <span className="!cursor-pointer text-sm">{navItem.name}</span>
          </a>
        ))}
      </motion.nav>
    </AnimatePresence>
  );
};
