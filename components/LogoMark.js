"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const sizes = {
  sm: { box: "h-9 w-9", px: 36, pad: "p-0.5" },
  lg: { box: "h-32 w-32 sm:h-40 sm:w-40", px: 160, pad: "p-2" },
};

export default function LogoMark({ size = "sm", className = "", priority = false }) {
  const { box, px, pad } = sizes[size];
  const [hovering, setHovering] = useState(false);
  const [spot, setSpot] = useState({ dx: 0, dy: 0 });

  const updateSpot = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpot({
      dx: (event.clientX - rect.left) / rect.width - 0.5,
      dy: (event.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  // Light at cursor → soft shadow falls on the opposite side (Supabase logic, shadow not color)
  const shadow = hovering
    ? `${-spot.dx * 6}px ${-spot.dy * 5}px 16px -8px color-mix(in srgb, var(--color-foreground) 6%, transparent)`
    : "0 1px 6px -3px color-mix(in srgb, var(--color-foreground) 3%, transparent)";

  return (
    <motion.div
      className={`relative shrink-0 ${box} ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setSpot({ dx: 0, dy: 0 });
      }}
      onMouseMove={updateSpot}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-[var(--color-logo-tile)] transition-[box-shadow] duration-150 ease-out"
        style={{ boxShadow: shadow }}
      >
        <Image
          src="/images/logo.png"
          alt="Casper Schepkens"
          width={px}
          height={px}
          priority={priority}
          className={`absolute inset-0 h-full w-full object-contain ${pad} dark:hidden`}
        />
        <Image
          src="/images/logo-dark.png"
          alt="Casper Schepkens"
          width={px}
          height={px}
          priority={priority}
          className={`absolute inset-0 h-full w-full object-contain ${pad} hidden dark:block`}
        />
      </div>
    </motion.div>
  );
}
