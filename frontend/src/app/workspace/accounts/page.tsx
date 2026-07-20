"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Wallet,
  Building2,
  ChevronRight,
  Copy,
  ExternalLink,
  Shield,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getStoredSafes, StoredSafeAccount } from "@/lib/safe-storage";

export default function WorkspaceAccountsPage() {
  const router = useRouter();
  const [safes, setSafes] = useState<StoredSafeAccount[]>([]);

  useEffect(() => {
    setSafes(getStoredSafes());
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-[#F5F5F7] min-h-screen">
      {/* Page Title & Action Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
          Accounts
        </h1>

        <button
          onClick={() => router.push("/accounts")}
          className="px-5 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Manage accounts</span>
        </button>
      </div>

      {/* Main Content Area */}
      {safes.length === 0 ? (
        <div className="w-full p-16 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl min-h-[440px] flex flex-col items-center justify-center text-center space-y-5">
          {/* Overlapping Circles Plus + Wallet Graphic (Matching Reference Screenshot 100%) */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-[#8B8FE8]/25 border border-[#8B8FE8]/50 flex items-center justify-center text-[#8B8FE8] shadow-inner">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <div className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-[#18181B] border border-[rgba(245,245,247,0.15)] flex items-center justify-center text-[#F5F5F7] shadow-2xl z-10">
              <Wallet className="w-7 h-7 text-[#8B8FE8]" />
            </div>
          </div>

          <p className="text-sm text-[#71717A] max-w-sm leading-relaxed font-sans">
            Add existing accounts in your space to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {safes.map((safe) => (
            <div
              key={safe.id}
              className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#18181B] border border-[rgba(245,245,247,0.08)] flex items-center justify-center text-[#8B8FE8] shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                      {safe.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 text-[10px] font-mono text-[#8B8FE8] flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>eERC Encrypted</span>
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#71717A] flex items-center gap-2">
                    <span>{safe.address}</span>
                    <Copy
                      className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]"
                      onClick={() => toast.success("Address copied")}
                    />
                    <span className="text-[10px] text-[#71717A]/60">• {safe.network} ({safe.threshold})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end md:self-auto">
                <div className="text-right font-mono">
                  <span className="text-[10px] uppercase text-[#71717A] block">VAULT BALANCE</span>
                  <span className="text-sm font-bold text-[#F5F5F7]">${safe.balance || "0.00"}</span>
                </div>

                <button
                  onClick={() => router.push(`/account?id=${safe.id}`)}
                  className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] hover:text-[#8B8FE8] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
