"use client";

import React, { useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { SentinelLogo } from "@/components/sentinel-logo";
import { AvalancheLogo } from "@/components/avalanche-logo";
import { ArrowRight, ExternalLink } from "lucide-react";

export function FooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Smooth mouse coordinates for custom cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newId = Date.now();
    setRipples((prev) => [...prev.slice(-5), { id: newId, x, y }]);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative bg-[#0A0A0B] border-t border-[rgba(245,245,247,0.08)] overflow-hidden select-none cursor-default"
    >
      {/* Custom Mouse Follower Dot */}
      {isHovered && (
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="pointer-events-none absolute z-30 w-2.5 h-2.5 rounded-full bg-[#8B8FE8] shadow-[0_0_12px_rgba(139,143,232,0.8)]"
        />
      )}

      {/* Interactive Click Shockwave Ripples */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 7, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            left: r.x,
            top: r.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="pointer-events-none absolute z-20 w-16 h-16 rounded-full border border-[#8B8FE8] bg-[#8B8FE8]/10 shadow-[0_0_40px_rgba(139,143,232,0.5)]"
          onAnimationComplete={() => {
            setRipples((prev) => prev.filter((item) => item.id !== r.id));
          }}
        />
      ))}

      {/* ── TOP SECTION: BRAND HEADLINE MARQUEE ── */}
      <div className="pt-10 pb-8 md:pt-14 md:pb-10 border-b border-[rgba(245,245,247,0.08)] relative overflow-hidden select-none whitespace-nowrap flex items-center">
        {/* Subtle Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          {/* <SentinelLogo size={420} iconOnly /> */}
        </div>

        <div className="inline-flex w-max items-center" style={{ animation: "marquee 25s linear infinite" }}>
          <div className="flex items-center gap-8 sm:gap-14 md:gap-20 pr-8 sm:pr-14 md:pr-20">
            <span
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-normal py-2 font-display text-[#F5F5F7] hover:text-[#8B8FE8] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SENTINEL
            </span>
            <span className="text-2xl sm:text-4xl text-[#8B8FE8]/40">·</span>
            <span
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-normal py-2 font-display text-[#F5F5F7] hover:text-[#8B8FE8] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TREASURY
            </span>
            <span className="text-2xl sm:text-4xl text-[#8B8FE8]/40">·</span>
          </div>

          <div className="flex items-center gap-8 sm:gap-14 md:gap-20 pr-8 sm:pr-14 md:pr-20">
            <span
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-normal py-2 font-display text-[#F5F5F7] hover:text-[#8B8FE8] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SENTINEL
            </span>
            <span className="text-2xl sm:text-4xl text-[#8B8FE8]/40">·</span>
            <span
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-normal py-2 font-display text-[#F5F5F7] hover:text-[#8B8FE8] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TREASURY
            </span>
            <span className="text-2xl sm:text-4xl text-[#8B8FE8]/40">·</span>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION: NEWSLETTER + LINK COLUMNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Newsletter & Socials */}
        <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-[rgba(245,245,247,0.08)] space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-[#71717A] block">
              Newsletter
            </span>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-[#8B8FE8]/10 border border-[#8B8FE8]/25 text-[#8B8FE8] text-xs font-mono">
                ✓ Thank you. Treasury compliance updates enabled.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="treasury@organisation.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111113] border border-[rgba(245,245,247,0.08)] rounded-xl pl-4 pr-12 py-3 text-xs text-[#F5F5F7] placeholder:text-[#71717A]/50 focus:outline-none focus:border-[#8B8FE8]/40 transition-colors font-mono"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-2 rounded-lg bg-[#8B8FE8]/10 text-[#8B8FE8] hover:bg-[#8B8FE8] hover:text-[#0A0A0B] transition-all duration-200"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[9px] font-mono text-[#71717A] tracking-wider uppercase block">
                  AGREE TO PRIVACY & COMPLIANCE TERMS
                </span>
              </form>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 pt-6">
            <a
              href="https://github.com/Soujanya-Mctrl/Sentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.08)] flex items-center justify-center text-[#71717A] hover:text-[#8B8FE8] hover:border-[#8B8FE8]/30 transition-all duration-200"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.08)] flex items-center justify-center text-[#71717A] hover:text-[#8B8FE8] hover:border-[#8B8FE8]/30 transition-all duration-200"
              aria-label="X / Twitter"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.08)] flex items-center justify-center text-[#71717A] hover:text-[#8B8FE8] hover:border-[#8B8FE8]/30 transition-all duration-200"
              aria-label="Discord"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href="https://subnets.avax.network"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.08)] flex items-center justify-center text-[#71717A] hover:text-[#8B8FE8] hover:border-[#8B8FE8]/30 transition-all duration-200"
              aria-label="Avalanche Subnet"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Columns: Navigation Links */}
        <div className="lg:col-span-8 p-8 md:p-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
          {/* Column 1: Product */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] font-semibold block">
              Product
            </span>
            <ul className="space-y-2.5 font-sans text-[#71717A]">
              <li><a href="/dashboard" className="hover:text-[#F5F5F7] transition-colors">Encrypted Safe</a></li>
              <li><a href="/dashboard/treasury" className="hover:text-[#F5F5F7] transition-colors">eERC Protocol</a></li>
              <li><a href="/dashboard/policies" className="hover:text-[#F5F5F7] transition-colors">Policy Interceptor</a></li>
              <li><a href="/dashboard/audit" className="hover:text-[#F5F5F7] transition-colors">Audit Command</a></li>
            </ul>
          </div>

          {/* Column 2: Science */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] font-semibold block">
              Science
            </span>
            <ul className="space-y-2.5 font-sans text-[#71717A]">
              <li><a href="#architecture" className="hover:text-[#F5F5F7] transition-colors">ZK-SNARK Engine</a></li>
              <li><a href="#architecture" className="hover:text-[#F5F5F7] transition-colors">Fuji L1 Subnet</a></li>
              <li><a href="/docs" className="hover:text-[#F5F5F7] transition-colors">Security Spec</a></li>
              <li><a href="/dashboard/audit" className="hover:text-[#F5F5F7] transition-colors">Shamir Key Split</a></li>
            </ul>
          </div>

          {/* Column 3: Governance */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] font-semibold block">
              Governance
            </span>
            <ul className="space-y-2.5 font-sans text-[#71717A]">
              <li><a href="/dashboard/members" className="hover:text-[#F5F5F7] transition-colors">Signer Roles</a></li>
              <li><a href="/dashboard/policies" className="hover:text-[#F5F5F7] transition-colors">Compliance Guard</a></li>
              <li><a href="/dashboard/settings" className="hover:text-[#F5F5F7] transition-colors">Interceptor Module</a></li>
              <li><a href="/dashboard" className="hover:text-[#F5F5F7] transition-colors">Emergency Lock</a></li>
            </ul>
          </div>

          {/* Column 4: Assistance / Resources */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F5F7] font-semibold block">
              Assistance
            </span>
            <ul className="space-y-2.5 font-sans text-[#71717A]">
              <li><a href="/docs" className="hover:text-[#F5F5F7] transition-colors">Documentation</a></li>
              <li><a href="https://github.com/Soujanya-Mctrl/Sentinel" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F7] transition-colors">GitHub Repository</a></li>
              <li><a href="/docs" className="hover:text-[#F5F5F7] transition-colors">Whitepaper</a></li>
              <li><a href="https://subnets.avax.network" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F5F7] transition-colors">Network Status</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR: COPYRIGHT & AVALANCHE BADGE ── */}
      <div className="p-6 md:px-12 border-t border-[rgba(245,245,247,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-mono text-[#71717A]">
        <div>
          COPYRIGHT © 2026 SENTINEL TREASURY. ALL RIGHTS RESERVED.
        </div>

        <div className="flex items-center gap-2">
          <AvalancheLogo className="w-3.5 h-3.5 text-[#8B8FE8]" />
          <span className="uppercase text-[#8B8FE8]">BUILT ON AVALANCHE FUJI SUBNET</span>
        </div>
      </div>
    </footer>
  );
}
