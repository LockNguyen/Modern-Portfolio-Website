"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { navItems } from "@/data";
import { cn } from "@/lib/utils";

type FloatingNavProps = {
  navItems: typeof navItems;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const cubicEaseOut = (t: number) => {
  return 1 - Math.pow(1 - t, 3);
};

const isMobileViewport = () => {
  return window.matchMedia("(max-width: 767px)").matches;
};

/* -------------------------------------------------------------------------- */
/* Animation + behavior constants                                             */
/* -------------------------------------------------------------------------- */

const INTRO_VISIBLE_DURATION_MS = 3000;

const DESKTOP_NAV = {
  // Past this distance, the desktop nav is fully hidden above the viewport.
  hiddenDistance: 300,

  // Within this distance, the desktop nav opens fully.
  bloomDistance: 100,

  // During the attraction zone, the desktop nav only peeks slightly.
  minPeek: 0.1,
  maxPeek: 0.13,
};

const desktopSpring = {
  stiffness: 260,
  damping: 26,
  mass: 0.8,
};

const mobileSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.8,
};

const iconTransition = {
  duration: 0.15,
};

const mobileMenuTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  // Show the desktop nav regardless for 3 seconds initially
  const [visibleRegardless, setVisibleRegardless] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Desktop attraction value:
   *
   * 0       = fully hidden above the screen
   * 0.1     = tiny peek
   * 0.13    = maximum held-back peek
   * 1       = fully visible
   */
  const attraction = useMotionValue(1);

  const smoothAttraction = useSpring(attraction, desktopSpring);

  /**
   * Desktop nav transforms.
   *
   * The nav starts far above the screen, peeks slightly,
   * then blooms into full visibility as the cursor gets closer.
   */
  const desktopY = useTransform(
    smoothAttraction,
    [0, DESKTOP_NAV.minPeek, 1],
    ["-150%", "-130%", "0%"]
  );

  const desktopOpacity = useTransform(
    smoothAttraction,
    [0, 0.03, 1],
    [0, 1, 1]
  );

  const desktopBlur = useTransform(
    smoothAttraction,
    [0, DESKTOP_NAV.maxPeek, 1],
    ["blur(0px)", "blur(10px)", "blur(0px)"]
  );

  /* ------------------------------------------------------------------------ */
  /* First load navbar forced visibility                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    // On first load, show the desktop nav briefly so users know it exists.
    // After that, hand control over to the cursor attraction behavior.
    const introTimer = window.setTimeout(() => {
      setVisibleRegardless(false);
      attraction.set(0);
    }, INTRO_VISIBLE_DURATION_MS);

    return () => window.clearTimeout(introTimer);
  }, [attraction]);

  /* ------------------------------------------------------------------------ */
  /* Desktop cursor attraction behavior                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Mobile uses the hamburger menu instead of cursor attraction.
      if (isMobileViewport()) return;

      if (!desktopNavRef.current || visibleRegardless) return;

      const rect = desktopNavRef.current.getBoundingClientRect();

      // Calculate distance from cursor to the nav.
      const dx = Math.max(
        rect.left - event.clientX,
        event.clientX - rect.right,
        0 // If the cursor is inside the nav (negative dx), ensure distance will be 0.
      );

      const dy = Math.max(
        rect.top - event.clientY,
        event.clientY - rect.bottom,
        0 // If the cursor is inside the nav (negative dy), ensure distance will be 0.
      );

      const distance = Math.sqrt(dx * dx + dy * dy);

      // Zone 1: Cursor is too far away. Hide completely.
      if (distance > DESKTOP_NAV.hiddenDistance) {
        attraction.set(0);
        return;
      }

      // Zone 2: Cursor is nearby, but not close enough for full bloom.
      // The nav peeks out only slightly, as if pulled but restrained.
      if (distance > DESKTOP_NAV.bloomDistance) {
        const progress = clamp(
          (DESKTOP_NAV.hiddenDistance - distance) /
          (DESKTOP_NAV.hiddenDistance - DESKTOP_NAV.bloomDistance),
          0,
          1
        );

        const easedProgress = cubicEaseOut(progress);

        attraction.set(
          DESKTOP_NAV.minPeek +
          easedProgress * (DESKTOP_NAV.maxPeek - DESKTOP_NAV.minPeek)
        );

        return;
      }

      // Zone 3: Cursor is close. Bloom from the held-back peek to fully visible.
      const bloomProgress = clamp(
        (DESKTOP_NAV.bloomDistance - distance) / DESKTOP_NAV.bloomDistance,
        0,
        1
      );

      const easedBloom = cubicEaseOut(bloomProgress);

      attraction.set(
        DESKTOP_NAV.maxPeek + easedBloom * (1 - DESKTOP_NAV.maxPeek)
      );
    };

    const handleMouseLeave = () => {
      if (!visibleRegardless) {
        attraction.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [visibleRegardless, attraction]);

  /* ------------------------------------------------------------------------ */
  /* Mobile click-away behavior                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileNavRef.current) return;

      if (!mobileNavRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      {/* Desktop: magnetic floating nav */}

      <motion.nav
        ref={desktopNavRef}
        initial={{
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
        }}
        style={{
          y: desktopY,
          opacity: desktopOpacity,
          filter: desktopBlur,
        }}
        className={cn(
          "fixed inset-x-0 top-5 z-[5000] mx-auto hidden max-w-fit items-center justify-center space-x-4 rounded-full px-10 py-4 backdrop-blur-lg bg-transparent saturate-150 lighting-glass md:flex",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`desktop-link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-1 text-neutral-600 hover:text-blue-700",
              "dark:text-neutral-50 dark:hover:text-galaxy"
            )}
          >
            <span className="!cursor-pointer text-sm">{navItem.name}</span>
          </a>
        ))}
      </motion.nav>

      {/* Mobile: expandable glass hamburger menu */}

      <motion.div
        ref={mobileNavRef}
        layout
        initial={false}
        animate={{
          width: mobileOpen ? 200 : 52,
          height: mobileOpen ? "auto" : 52,
          borderRadius: 28,
        }}
        transition={mobileSpring}
        className={cn(
          "fixed right-5 top-5 z-[5000] flex overflow-hidden bg-black-100/20 backdrop-blur-lg saturate-150 lighting-glass md:hidden"
        )}
      >
        <div className="relative flex w-full flex-col">
          {/* The button to open and close the mobile menu */}
          <button
            type="button"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className={cn(
              "absolute right-0 top-0 z-10 flex h-[52px] w-[52px] items-center justify-center",
              "text-neutral-700 outline-none transition-colors dark:text-neutral-50"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{
                    rotate: 0,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    rotate: -90,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    rotate: -180,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={iconTransition}
                  className="flex items-center justify-center"
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={iconTransition}
                  className="flex items-center justify-center"
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* The expanded menu items */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-menu-items"
                initial={{
                  opacity: 0,
                  y: -8,
                  filter: "blur(6px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  filter: "blur(6px)",
                }}
                transition={mobileMenuTransition}
                className="flex flex-col gap-8 p-8 pt-12"
              >
                {navItems.map((navItem, idx) => (
                  <motion.a
                    key={`mobile-link-${idx}`}
                    href={navItem.link}
                    onClick={() => setMobileOpen(false)}
                    initial={{
                      opacity: 0,
                      x: 10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 10,
                    }}
                    transition={{
                      duration: 0.18,
                      delay: idx * 0.07,
                      ease: "easeOut",
                    }}
                    className={cn(
                      "rounded-full text-sm text-neutral-600 transition-colors hover:text-blue-700",
                      "dark:text-neutral-50 dark:hover:text-galaxy"
                    )}
                  >
                    {navItem.name}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};