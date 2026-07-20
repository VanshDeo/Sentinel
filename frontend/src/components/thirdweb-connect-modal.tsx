"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ChevronRight } from "lucide-react";

interface ThirdwebConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
}

export function ThirdwebConnectModal({
  isOpen,
  onClose,
  onSelectWallet,
}: ThirdwebConnectModalProps) {
  if (!isOpen) return null;

  const options = [
    {
      id: "core",
      name: "Core Wallet",
      category: "Avalanche Subnet Native",
    },
    {
      id: "metamask",
      name: "MetaMask",
      category: "EVM Extension Provider",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      category: "Smart Passkeys",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      category: "Mobile Protocol Link",
    },
    {
      id: "ledger",
      name: "Ledger Vault",
      category: "Hardware Enclave",
    },
    {
      id: "trezor",
      name: "Trezor Security",
      category: "Hardware Key",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row relative"
        >
          {/* Left Panel - Brand Identity */}
          <div className="w-full md:w-2/5 p-7 bg-[#0E0E10]/90 border-b md:border-b-0 md:border-r border-[rgba(245,245,247,0.06)] flex flex-col justify-between space-y-6">
            <div>
              {/* Sentinel Logo Only */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo/logo - horizontal.png"
                  alt="Sentinel Logo"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-lg font-bold text-[#F5F5F7] mt-6 tracking-tight">
                Connect your wallet
              </h2>
              <p className="text-xs text-[#71717A] font-mono leading-relaxed mt-2">
                Select an authorized authorization provider to sign in to your encrypted treasury workspace.
              </p>
            </div>

            {/* Bottom Policy Security Badge */}
            <div className="p-3 rounded-2xl bg-[#111113] border border-[rgba(245,245,247,0.06)] flex items-center gap-2.5 text-[10px] text-[#71717A] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#8B8FE8] shrink-0" />
              <span>Sentinel Zero-Knowledge Multi-Sig Interceptor</span>
            </div>
          </div>

          {/* Right Panel - Text-Based Clean Options Grid */}
          <div className="w-full md:w-3/5 p-7 bg-[#111113] flex flex-col justify-between space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
                Available Options (6)
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-xl text-[#71717A] hover:text-[#F5F5F7] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2x3 Minimalist Text Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectWallet(item.id)}
                  className="p-4 rounded-2xl bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/50 flex items-center justify-between transition-all cursor-pointer group text-left"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#71717A] font-mono mt-0.5">
                      {item.category}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#8B8FE8] transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Subnet Network Tag */}
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Network: Avalanche Fuji Subnet</span>
              <span className="text-[#8B8FE8]">eERC Enabled</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
