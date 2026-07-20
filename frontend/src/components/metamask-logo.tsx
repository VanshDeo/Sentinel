"use client";

import React, { useEffect, useRef } from "react";
// @ts-ignore
import ModelViewer from "@metamask/logo";

export function MetaMaskLogo({ size = 36 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const viewer = ModelViewer({
        pxNotRatio: true,
        width: size,
        height: size,
        followMouse: true,
        slowOnLeave: true,
      });

      const el = containerRef.current;
      el.innerHTML = "";
      el.appendChild(viewer.container);

      return () => {
        try {
          viewer.stopAnimation();
        } catch (e) {}
        if (el) el.innerHTML = "";
      };
    } catch (err) {
      console.warn("MetaMask logo 3D viewer init error:", err);
    }
  }, [size]);

  return <div ref={containerRef} className="w-9 h-9 flex items-center justify-center overflow-hidden shrink-0" />;
}
