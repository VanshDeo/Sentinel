"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, ChevronDown, Shield, Search, CheckCircle, Lock, Unlock, Eye, Cpu, Sliders, Share2, Layers } from "lucide-react";

import { SentinelLogo, SentinelWordmark } from "@/components/sentinel-logo";
import { CircuitGrid } from "@/components/circuit-grid";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { ScrambleText, useScrambleText } from "@/components/motion/scramble-text";
import { FadeInView, FadeInLeft, FadeInRight } from "@/components/motion/fade-in-view";
import { StaggerChildren, staggerChildVariant } from "@/components/motion/stagger-text";
import { Marquee } from "@/components/marquee";
import { Button } from "@/components/ui/button";
import { WobbleCard } from "@/components/ui/wobble-card";
import { FooterSection } from "@/components/footer-section";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

/* ══════════════════════════════════════
   SECTION 1 — HERO
   ══════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 overflow-hidden"
    >
      <BackgroundRippleEffect rows={14} cols={32} cellSize={54} />
      <CircuitGrid />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl text-center">
        {/* Logo mark lockup */}
        <SentinelLogo size={160} animate />

        {/* Headline — serif emotional line */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          Privacy that isn&apos;t secrecy.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base md:text-lg text-[#71717A] max-w-xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          Encrypted treasuries with policy checks before settlement, and audit access no single person controls.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          <Button size="lg" asChild>
            <a href="/onboarding">
              Launch app
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <a href="/docs">Read the docs</a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[#71717A]"
        style={{ animation: "chevron-pulse 2s ease-in-out infinite" }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════
   SECTION 2 — THE PROBLEM
   ══════════════════════════════════════ */
function ProblemSection() {
  const [inView, setInView] = useState(false);

  const scrambledRows = [
    { label: "Treasury #0x7a…3f", amount: "142,500.00 USDC", status: "Approved" },
    { label: "Treasury #0x2c…e8", amount: "89,000.00 AVAX", status: "Pending" },
    { label: "Treasury #0x9d…b1", amount: "1,250,000.00 USDC", status: "Blocked" },
  ];

  return (
    <section id="problem" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInView className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-[#71717A] mb-4 font-mono">The problem</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F5F5F7]">
            Transparency shouldn&apos;t mean exposure.
          </h2>
        </FadeInView>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 rounded-lg border border-[rgba(245,245,247,0.08)] overflow-hidden"
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Left — What everyone sees (scrambled, recessed bg) */}
          <div className="relative bg-[#0E0E10] p-8 md:p-10">
            <div className="scan-line-overlay rounded-lg" />
            <p className="text-xs tracking-widest uppercase text-[#EF4444]/80 mb-6 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              What everyone else sees
            </p>
            <div className="space-y-4">
              {scrambledRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-[rgba(245,245,247,0.04)] last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <ScrambleText
                      text={row.label}
                      scrambled={!inView}
                      trigger={false}
                      className="text-sm text-[#71717A]/70"
                    />
                    <ScrambleText
                      text={row.amount}
                      scrambled={!inView}
                      trigger={false}
                      className="text-base font-medium text-[#F5F5F7]/80"
                    />
                  </div>
                  <ScrambleText
                    text={row.status}
                    scrambled={!inView}
                    trigger={false}
                    className="text-xs tracking-wider uppercase text-[#71717A]/55"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right — What Sentinel sees (clear, raised bg with subtle glow) */}
          <div className="relative bg-[#111113] p-8 md:p-10 border-t md:border-t-0 md:border-l border-[rgba(245,245,247,0.08)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B8FE8]/4 rounded-full blur-2xl pointer-events-none" />
            <p className="text-xs tracking-widest uppercase text-[#8B8FE8] mb-6 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              What Sentinel sees
            </p>
            <div className="space-y-4">
              {scrambledRows.map((row, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-[rgba(245,245,247,0.06)] last:border-0"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#71717A]">{row.label}</span>
                    <span className="text-base font-medium text-[#F5F5F7]">{row.amount}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded border ${
                      row.status === "Approved"
                        ? "text-[#00E676] bg-[#00E676]/6 border-[#00E676]/15"
                        : row.status === "Blocked"
                        ? "text-[#FF3B30] bg-[#FF3B30]/6 border-[#FF3B30]/15"
                        : "text-[#FFB800] bg-[#FFB800]/6 border-[#FFB800]/15"
                    }`}
                  >
                    {row.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   SECTION 3 — HOW IT WORKS
   ══════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Propose",
      description: "Submit an encrypted transaction with the treasury policy attached.",
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Check",
      description: "Policy engine evaluates compliance without exposing transaction details.",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Settle",
      description: "Approved transactions execute on-chain. Rejected ones never reach the network.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6 overflow-hidden">
      <DottedGlowBackground
        gap={22}
        radius={1.5}
        color="rgba(245, 245, 247, 0.2)"
        glowColor="rgba(139, 143, 232, 0.8)"
        opacity={0.35}
        speedMin={0.4}
        speedMax={1.2}
      />
      <div className="relative z-10 max-w-5xl mx-auto">
        <FadeInView className="text-center mb-20">
          <p className="text-sm tracking-widest uppercase text-[#71717A] mb-4 font-mono">How it works</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F5F5F7]">
            Three steps. Zero exposure.
          </h2>
        </FadeInView>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Cards */}
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative z-10 group rounded-lg border border-[rgba(245,245,247,0.08)] bg-[#111113] p-8 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              whileHover={{
                y: -4,
                boxShadow: "0 0 30px rgba(139,143,232,0.08)",
                borderColor: "rgba(139,143,232,0.2)",
              }}
            >
              {/* Step number */}
              <span className="text-xs text-[#71717A] tracking-widest mb-4 block">
                0{i + 1}
              </span>

              {/* Icon in S-shard style container */}
              <div className="w-10 h-10 rounded-md bg-[#8B8FE8]/10 border border-[#8B8FE8]/20 flex items-center justify-center text-[#8B8FE8] mb-5">
                {step.icon}
              </div>

              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   SECTION 4 — COMPARISON
   ══════════════════════════════════════ */
function ComparisonSection() {
  const features = [
    { label: "Transaction privacy", public: "None", singleKey: "Full", sentinel: "Full" },
    { label: "Policy enforcement", public: "Manual", singleKey: "Manual", sentinel: "Automated" },
    { label: "Audit access", public: "Everyone", singleKey: "Key holder", sentinel: "Multi-party" },
    { label: "Single point of failure", public: "N/A", singleKey: "Yes", sentinel: "No" },
    { label: "Regulatory compliance", public: "By default", singleKey: "Blocked", sentinel: "Built-in" },
  ];

  return (
    <section id="comparison" className="relative py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        <FadeInView className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-[#71717A] mb-4 font-mono">Why Sentinel</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F5F5F7]">
            Not just private. Accountable.
          </h2>
        </FadeInView>

        <FadeInView delay={0.2}>
          <div className="rounded-lg border border-[rgba(245,245,247,0.08)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 bg-[#111113]">
              <div className="p-4 text-xs tracking-widest uppercase text-[#71717A]" />
              <div className="p-4 text-xs tracking-widest uppercase text-[#71717A] text-center">Public</div>
              <div className="p-4 text-xs tracking-widest uppercase text-[#71717A] text-center">Single-key</div>
              <div className="p-4 text-xs tracking-widest uppercase text-[#8B8FE8] text-center border-b-2 border-[#8B8FE8] font-medium">
                Sentinel
              </div>
            </div>

            {/* Rows */}
            {features.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-4 border-t border-[rgba(245,245,247,0.06)]"
              >
                <div className="p-4 text-sm text-[#F5F5F7]">{row.label}</div>
                <div className="p-4 text-sm text-[#71717A] text-center">{row.public}</div>
                <div className="p-4 text-sm text-[#71717A] text-center">{row.singleKey}</div>
                <div className="p-4 text-sm text-[#F5F5F7] text-center font-medium bg-[#8B8FE8]/5 border-l border-[rgba(139,143,232,0.1)]">
                  {row.sentinel}
                </div>
              </div>
            ))}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   SECTION 5 — CTA FOOTER
   ══════════════════════════════════════ */
function CTAFooter() {
  return (
    <section id="footer" className="relative pt-24 bg-[#0A0A0B]">
      {/* CTA Block */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pb-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* <SentinelLogo size={280} opacity={0.04} iconOnly /> */}
        </div>

        <FadeInView>
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight text-[#F5F5F7]">
            Start building with Sentinel.
          </h2>
          <p className="text-[#71717A] mb-10 max-w-md mx-auto">
            Deploy encrypted treasuries with automated compliance and multi-party audit.
          </p>
          <Button size="lg" asChild>
            <a href="/onboarding">
              Get started
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </FadeInView>
      </div>

      {/* Main Footer with Giant Wordmark, Grid Compartments & Pointer Follower */}
      <FooterSection />
    </section>
  );
}

/* ══════════════════════════════════════
   SECTION 3.5 — TECHNICAL ARCHITECTURE (Bento Grid)
   ══════════════════════════════════════ */
function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-32 px-6 bg-[#0A0A0B]">
      <div className="max-w-6xl mx-auto">
        <FadeInView className="text-center mb-20">
          <p className="text-sm tracking-widest uppercase text-[#71717A] mb-4 font-mono">Technical Architecture</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#F5F5F7]">
            Built for execution. Designed for trust.
          </h2>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: eERC Integration Layer (col-span-2) */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[380px] bg-[#111113] relative">
            <div className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-lg bg-[rgba(139,143,232,0.06)] border border-[rgba(139,143,232,0.12)] flex items-center justify-center text-[#8B8FE8]">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="max-w-xl">
              <span className="text-[10px] tracking-widest uppercase text-[#8B8FE8] font-semibold mb-3 block font-mono">01 / eERC Integration</span>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#F5F5F7] tracking-tight">
                eERC Wrapped Asset Converter
              </h3>
              <p className="text-sm text-[#71717A] leading-relaxed mb-6">
                Sentinel uses a converter model rather than standalone pools. It wraps existing ERC-20 tokens, letting treasuries exit back to public forms at the edge when paying out to non-eERC registered parties.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-[rgba(245,245,247,0.06)] pt-6">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-[#71717A] block mb-2 font-semibold font-mono">Public On-Chain</span>
                  <div className="space-y-1.5 font-mono text-[#A1A1AA]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
                      <span>Sender & Recipient addresses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#71717A]" />
                      <span>ZK-SNARK Balance proof (Groth16)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-[#8B8FE8] block mb-2 font-semibold font-mono">Encrypted / Private</span>
                  <div className="space-y-1.5 font-mono text-[#F5F5F7]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
                      <span>Transfer amount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
                      <span>Remaining balance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WobbleCard>

          {/* Card 2: Policy Checker Guard (col-span-1) */}
          <WobbleCard containerClassName="col-span-1 min-h-[380px] bg-[#111113] relative">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-[rgba(139,143,232,0.06)] border border-[rgba(139,143,232,0.12)] flex items-center justify-center text-[#8B8FE8]">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#8B8FE8] font-semibold mb-3 block font-mono">02 / Policy Check</span>
                <h3 className="text-xl font-semibold mb-4 text-[#F5F5F7] tracking-tight">
                  Pre-Settlement Guard
                </h3>
                <p className="text-sm text-[#71717A] leading-relaxed pr-8">
                  Hooks into Safe&apos;s native Guard transaction flow. Proposed transfers are decrypted by the checker using a scoped VIEW key to evaluate amount limits and allowlists before the signature flow is unlocked.
                </p>
              </div>
              <div className="border-t border-[rgba(245,245,247,0.06)] pt-4 mt-6 text-xs text-[#8B8FE8]/80 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8] animate-pulse" />
                <span>Pre-Approval Verification Guard</span>
              </div>
            </div>
          </WobbleCard>

          {/* Card 3: Split-Custody Key Sharing (col-span-1) */}
          <WobbleCard containerClassName="col-span-1 min-h-[380px] bg-[#111113] relative">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-[rgba(139,143,232,0.06)] border border-[rgba(139,143,232,0.12)] flex items-center justify-center text-[#8B8FE8]">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#8B8FE8] font-semibold mb-3 block font-mono">03 / Split Custody</span>
                <h3 className="text-xl font-semibold mb-4 text-[#F5F5F7] tracking-tight">
                  2-of-3 Shamir Splits
                </h3>
                <p className="text-sm text-[#71717A] leading-relaxed pr-8">
                  Decryption keys are divided into 3 shares (Finance Lead, Independent Auditor, Governance Rep). Reconstructing access requires 2 cooperating shares, eliminating single points of failure.
                </p>
              </div>
              <div className="border-t border-[rgba(245,245,247,0.06)] pt-4 mt-6 text-xs text-[#8B8FE8]/80 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
                <span>Multi-Party Decryption Flow</span>
              </div>
            </div>
          </WobbleCard>

          {/* Card 4: Batched Settlement (col-span-2) */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[380px] bg-[#111113] relative">
            <div className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-lg bg-[rgba(139,143,232,0.06)] border border-[rgba(139,143,232,0.12)] flex items-center justify-center text-[#8B8FE8]">
              <Layers className="w-5 h-5" />
            </div>
            <div className="max-w-xl flex flex-col h-full justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#8B8FE8] font-semibold mb-3 block font-mono">04 / Batched Settlement</span>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#F5F5F7] tracking-tight">
                  Metadata Anonymity Window
                </h3>
                <p className="text-sm text-[#71717A] leading-relaxed mb-6">
                  Approved transactions queue into a pending state and execute as a combined batch. An observer sees transactions settle in the block but cannot correlate individual proposals to execution events.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-[rgba(245,245,247,0.06)] pt-4">
                <div>
                  <span className="text-[#8B8FE8] block mb-0.5">Post-Etna L1 cost:</span>
                  <span className="text-[#F5F5F7]">~1.33 AVAX / month</span>
                </div>
                <div>
                  <span className="text-[#8B8FE8] block mb-0.5">Safe multisigs assets:</span>
                  <span className="text-[#F5F5F7]">$100B+ secured</span>
                </div>
              </div>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0A0A0B]">
      {/* Page-wide fixed ambient background */}
      <DottedGlowBackground
        className="fixed inset-0 pointer-events-none z-0"
        opacity={0.25}
        gap={28}
        radius={1.1}
        color="rgba(139, 143, 232, 0.2)"
        glowColor="rgba(108, 111, 224, 0.35)"
        darkColor="rgba(139, 143, 232, 0.25)"
        darkGlowColor="rgba(108, 111, 224, 0.4)"
        backgroundOpacity={0}
        speedMin={0.05}
        speedMax={0.25}
        speedScale={0.4}
      />
      <div className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <ArchitectureSection />
        <ComparisonSection />
        <CTAFooter />
      </div>
    </main>
  );
}
