"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ChevronDown, 
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/components/wallet-provider";
import { getStoredSafes } from "@/lib/safe-storage";

export default function AssetsPage() {
  const { address: walletAddr } = useWallet();
  const [activeTab, setActiveTab] = useState<"tokens" | "positions" | "nfts">("tokens");
  const [qrChainPrefix, setQrChainPrefix] = useState(true);

  const [activeAccount, setActiveAccount] = useState<{ name: string; address: string } | null>(null);

  useEffect(() => {
    const loaded = getStoredSafes();
    if (loaded.length > 0) {
      setActiveAccount(loaded[0]);
    } else if (walletAddr) {
      setActiveAccount({ name: "Connected Account", address: walletAddr });
    }
  }, [walletAddr]);

  const displayAddr = activeAccount?.address || walletAddr || "0x0000000000000000000000000000000000000000";
  const displayName = activeAccount?.name || "Treasury Account";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      
      {/* Sub-Tabs: Tokens, Positions, NFTs */}
      <div className="flex items-center gap-6 border-b border-[rgba(245,245,247,0.08)] pb-3 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("tokens")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "tokens"
              ? "border-[#8B8FE8] text-[#8B8FE8]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          Tokens
        </button>

        <button
          onClick={() => setActiveTab("positions")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "positions"
              ? "border-[#8B8FE8] text-[#8B8FE8]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          Positions
        </button>

        <button
          onClick={() => setActiveTab("nfts")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "nfts"
              ? "border-[#8B8FE8] text-[#8B8FE8]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          NFTs
        </button>
      </div>

      {/* Total Assets Value Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider block">
            Total assets value
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F5F5F7] mt-1">
            0 ETH
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#71717A] flex items-center gap-1.5">
            <span>Updated 1 minute ago</span>
            <RefreshCw className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" onClick={() => toast.info("Assets refreshed")} />
          </span>

          <button className="px-4 py-2 rounded-xl bg-[#111113] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] hover:border-[#8B8FE8]/40 transition-colors">
            Manage tokens
          </button>

          <button className="px-3.5 py-2 rounded-xl bg-[#111113] border border-[rgba(245,245,247,0.08)] text-xs font-mono text-[#F5F5F7] flex items-center gap-1.5 hover:border-[#8B8FE8]/40 transition-colors">
            <span>USD</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>
        </div>
      </div>

      {/* Add Funds QR Code Card (Matching Screenshot 2) */}
      <div className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: QR Code Illustration */}
        <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl bg-[#0A0A0B] border border-[rgba(245,245,247,0.06)]">
          <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center shadow-inner">
            {/* SVG QR Code Simulation */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
              <path d="M0,0 h35 v35 h-35 z M5,5 v25 h25 v-25 z M10,10 h15 v15 h-15 z M65,0 h35 v35 h-35 z M70,5 v25 h25 v-25 z M75,10 h15 v15 h-15 z M0,65 h35 v35 h-35 z M5,70 v25 h25 v-25 z M10,75 h15 v15 h-15 z M45,10 h10 v15 h-10 z M45,45 h10 v10 h-10 z M65,65 h15 v15 h-15 z M85,85 h15 v15 h-15 z" />
            </svg>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#71717A]">
            <button
              onClick={() => setQrChainPrefix(!qrChainPrefix)}
              className={`w-8 h-4 rounded-full p-0.5 transition-colors ${qrChainPrefix ? "bg-[#8B8FE8]" : "bg-[#71717A]/30"}`}
            >
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${qrChainPrefix ? "translate-x-4" : "translate-x-0"}`} />
            </button>
            <span>QR code with chain prefix</span>
          </div>
        </div>

        {/* Right Side: Copy Address Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#F5F5F7]">Add funds to get started</h2>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Copy your address to send tokens from a different account.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#18181B] border border-[rgba(245,245,247,0.08)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              eth
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-bold text-[#F5F5F7]">{displayName}</h4>
              <p className="text-[11px] font-mono text-[#71717A] truncate flex items-center gap-1.5 mt-0.5">
                <span>eth:{displayAddr}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Copy className="w-4 h-4 text-[#71717A] hover:text-[#8B8FE8] cursor-pointer" onClick={() => toast.success("Address copied")} />
              <ExternalLink className="w-4 h-4 text-[#71717A] hover:text-[#8B8FE8] cursor-pointer" />
            </div>
          </div>
        </div>

      </div>

      {/* Don't See Your Tokens Warning Banner (Matching Screenshot 2) */}
      <div className="p-8 rounded-3xl bg-[#111113]/80 backdrop-blur-xl border border-[rgba(245,245,247,0.08)] space-y-4 max-w-2xl mx-auto text-center shadow-xl">
        <h3 className="text-base font-bold text-[#F5F5F7]">Don&apos;t see your tokens?</h3>
        <p className="text-xs text-[#71717A] leading-relaxed font-sans">
          Your Safe account is not activated yet so we can only display your native balance. Non-native tokens may not show up immediately after the Safe is deployed. Finish the onboarding to deploy your account onchain and unlock all features. You can always view all of your assets on the <a href="/docs" className="text-[#8B8FE8] underline">Block Explorer</a>.
        </p>

        <button
          onClick={() => toast.info("Account activation initiated")}
          className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
        >
          Activate now
        </button>
      </div>

    </div>
  );
}
