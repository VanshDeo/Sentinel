"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SentinelLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
  opacity?: number;
  iconOnly?: boolean;
}

/** Official Sentinel Horizontal Brand Logo Component */
export function SentinelLogo({
  className = "",
  size = 64,
  animate = false,
  opacity = 1,
}: SentinelLogoProps) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
      }
    : {};

  return (
    <Wrapper
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{ opacity }}
      {...wrapperProps}
    >
      <img
        src="/logo/logo - horizontal.png"
        alt="Sentinel Logo"
        className="w-auto object-contain shrink-0"
        style={{ height: size, width: "auto" }}
      />
    </Wrapper>
  );
}

/** Spinning loader variant using the official logo motif */
export function SentinelSpinner({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <motion.div
      className={cn("inline-flex shrink-0", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <SentinelLogo size={size} />
    </motion.div>
  );
}

/** Text wordmark including the slogan as styled in the uploaded logo */
export function SentinelWordmark({
  className = "",
  stagger = false,
  showSlogan = true,
}: {
  className?: string;
  stagger?: boolean;
  showSlogan?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img
        src="/logo/logo - horizontal.png"
        alt="Sentinel Logo"
        className="h-12 w-auto object-contain"
      />

      {showSlogan && (
        <div className="flex items-center gap-4 mt-4 w-full max-w-md px-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#8B8FE8]/40" />
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-[#71717A] font-medium uppercase whitespace-nowrap">
            Privacy & Compliance for On-Chain Treasuries
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#8B8FE8]/40" />
        </div>
      )}
    </div>
  );
}
