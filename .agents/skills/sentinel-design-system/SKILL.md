---
name: sentinel-design-system
description: >-
  Expert guidelines and reusable motion primitives for building the Sentinel
  privacy-centric treasury platform frontend.
---

# Sentinel Motion Design System

## Overview
This skill guides the design, typography, color palettes, and motion primitives for Sentinel. The theme is **privacy that isn't secrecy**, using a high-fidelity cyberpunk aesthetic (precise, clean, glowing, and high contrast) rather than playful or bouncy styles.

## Design Primitives

### 1. Palette
- **Background:** Near-black (`#0A0A0B`) for depth in dark mode.
- **Accent:** Periwinkle/Indigo (`#8B8FE8`) used sparingly for highlights, borders, and active status.
- **Base White:** Warm off-white (`#F5F5F7`).
- **Glow Accent:** Soft indigo (`#6C6FE0`) radial gradients behind cards or active states.

### 2. Typography
- **Technical/Display headings:** `Sector` display font (use uppercase, clean tracking).
- **Body & Long-form text:** Readable system sans-serif or clean monospaced font (never display font for long text).

### 3. Motion Philosophy
- **Speed:** Slow, deliberate, and precise reveals (300ms–600ms).
- **Easing:** Linear or ease-in-out transitions. No bouncy spring physics.
- **Motif:** Two interlocking "S" shards (light + dark) used for loading, section dividers, and hover indications.

---

## Reusable Motion Inventory

### A. Decrypt Scramble Text
A custom hook/component that cycles random characters before settling on the final string. Perfect for unlocking encrypted treasury data.

```tsx
import { useEffect, useState } from "react";

export function ScrambleText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEF0123456789X$/#%@&*";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayText}</span>;
}
```

### B. Scroll-Drawn SVG Connector
Draws an SVG path as the user scrolls down the page.

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ScrollLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <svg ref={ref} className="w-full h-12 overflow-visible">
      <motion.path
        d="M 0 24 H 1000"
        fill="none"
        stroke="#8B8FE8"
        strokeWidth="2"
        style={{ pathLength }}
      />
    </svg>
  );
}
```

### C. Hover Glow Card
Subtle y-axis translation combined with box-shadow periwinkle glow.

```tsx
import { motion } from "framer-motion";

export function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 10px 30px rgba(139, 143, 232, 0.15)",
        borderColor: "rgba(139, 143, 232, 0.4)"
      }}
      className="p-6 bg-[#111113] border border-[rgba(245,245,247,0.08)] rounded-2xl transition-colors duration-300"
    >
      {children}
    </motion.div>
  );
}
```
