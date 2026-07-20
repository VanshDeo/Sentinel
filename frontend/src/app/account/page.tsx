"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  ShieldCheck, 
  Shield, 
  Wallet,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

function SafeAccountOverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeChain = searchParams ? searchParams.get("chain") : "ethereum";
  const chainSymbol = activeChain === "avalanche" ? "AVAX" : "ETH";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      
      {/* Total Balance Card for Active Account */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl flex flex-col justify-between space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider block">
            Total balance
          </span>
          <span className="text-xs font-mono text-[#71717A] flex items-center gap-1.5">
            <span>Updated less than a minute ago</span>
            <RefreshCw className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" onClick={() => toast.info("Refreshed balance")} />
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F7]">
          0 {chainSymbol}
        </h1>
      </motion.div>

      {/* Activate Your Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#F5F5F7]">Activate your account</h2>
          <p className="text-xs text-[#71717A] font-mono">
            0 of 2 steps completed. Finish the next steps to start using all account features:
          </p>
        </div>

        {/* 3 Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Add Native Assets */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#8B8FE8]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full border border-[rgba(245,245,247,0.2)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#8B8FE8]/40" />
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 text-[10px] font-bold text-[#8B8FE8] font-mono">
                First interaction
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#F5F5F7]">Add native assets</h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Receive {activeChain === "avalanche" ? "Avalanche" : "Ether"} to start interacting with your account.
              </p>
            </div>

            <button
              onClick={() => router.push("/account/assets")}
              className="w-full py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
            >
              Add funds
            </button>
          </div>

          {/* Card 2: Activate Account on Active Chain */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#8B8FE8]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full border border-[rgba(245,245,247,0.2)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#8B8FE8]/40" />
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 text-[10px] font-bold text-[#8B8FE8] font-mono">
                First interaction
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#F5F5F7]">
                Activate account on {activeChain === "avalanche" ? "Avalanche" : "Ethereum"}
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Activate your account to start using all benefits of Sentinel.
              </p>
            </div>

            <button
              onClick={() => toast.success("Activation sequence initiated")}
              className="w-full py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
            >
              Activate now
            </button>
          </div>

          {/* Card 3: Enforce Enterprise-Grade Security */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#8B8FE8]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 text-[10px] font-bold text-[#8B8FE8] font-mono">
                Powered by Hypernative
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#F5F5F7]">Enforce enterprise-grade security</h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Automatically block risky transactions using advanced, user-defined security policies.
              </p>
            </div>

            <button
              onClick={() => router.push("/account/settings")}
              className="w-full py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#8B8FE8] transition-all cursor-pointer"
            >
              Learn more
            </button>
          </div>

        </div>
      </motion.div>

    </div>
  );
}

export default function SafeAccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#71717A]">Loading account overview...</div>}>
      <SafeAccountOverviewContent />
    </Suspense>
  );
}
