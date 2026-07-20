"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  ArrowDownLeft, 
  Repeat, 
  Code, 
  Plus, 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  UserPlus, 
  LayoutGrid, 
  AlertCircle,
  Copy,
  ExternalLink,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getStoredSafes, StoredSafeAccount } from "@/lib/safe-storage";

export default function WorkspaceHomePage() {
  const router = useRouter();

  const [safes, setSafes] = useState<StoredSafeAccount[]>([]);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  useEffect(() => {
    const loadedSafes = getStoredSafes();
    setSafes(loadedSafes);
    if (loadedSafes.length > 0) {
      setExpandedAccountId(loadedSafes[0].id);
    }
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      
      {/* Workspace Total Value Bar */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider block">
            Total value
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#F5F5F7] mt-1">
            $0.00
          </h1>
        </div>

        {/* 4 Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => toast.info("Send transfer modal")}
            className="px-6 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>

          <button
            onClick={() => toast.info("Receive funds QR")}
            className="px-6 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 text-[#8B8FE8]" />
            <span>Receive</span>
          </button>

          <button
            onClick={() => toast.info("Privacy Swap")}
            className="px-6 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Repeat className="w-4 h-4 text-[#8B8FE8]" />
            <span>Swap</span>
          </button>

          <button
            onClick={() => toast.info("Transaction Builder")}
            className="px-6 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Code className="w-4 h-4 text-[#8B8FE8]" />
            <span>Build transaction</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid Layout (Matching User Reference Screenshot 100%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Card: Accounts */}
        <div className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F5F5F7]">Accounts</h2>
            {safes.length > 0 && (
              <button
                onClick={() => router.push("/accounts")}
                className="px-4 py-2 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] hover:text-[#8B8FE8] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#8B8FE8]" />
                <span>Manage accounts</span>
              </button>
            )}
          </div>

          {/* Dynamic Accounts List or Initial Empty State (Matching Screenshot) */}
          {safes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 my-2">
              <div className="w-14 h-14 rounded-full bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8] shadow-inner">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#F5F5F7]">No accounts yet</h3>
                <p className="text-xs text-[#71717A] max-w-xs leading-relaxed font-sans">
                  Add your accounts to view balances and manage transactions.
                </p>
              </div>

              <button
                onClick={() => router.push("/accounts")}
                className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Manage accounts</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {safes.map((safe) => {
                const isExpanded = expandedAccountId === safe.id;

                return (
                  <div key={safe.id} className="space-y-2">
                    <div
                      onClick={() => setExpandedAccountId(isExpanded ? null : safe.id)}
                      className="p-4 rounded-2xl bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        {/* Identicon Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B8FE8] via-[#E84142] to-[#45D6A7] flex items-center justify-center text-[10px] font-bold text-white shadow-inner shrink-0">
                          0x
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-sm font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors truncate">
                            {safe.name}
                          </h3>
                          <p className="text-xs font-mono text-[#71717A] flex items-center gap-1.5 mt-0.5">
                            <span>{safe.address.slice(0, 6)}...{safe.address.slice(-4)}</span>
                            <Copy className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" onClick={(e) => { e.stopPropagation(); toast.success("Address copied"); }} />
                          </p>
                        </div>
                      </div>

                      {/* Chain Badges & Alert Icon */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-[#627EEA] flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                            Ξ
                          </div>
                          <div className="w-6 h-6 rounded-full bg-[#E84142] flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                            ▲
                          </div>
                        </div>
                        <AlertCircle className="w-4 h-4 text-[#E84142]" />
                      </div>
                    </div>

                    {/* Collapsible Chain Selector Dropdown */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-1 overflow-hidden pt-1"
                        >
                          <button
                            onClick={() => router.push(`/account?id=${safe.id}&chain=ethereum`)}
                            className="w-full p-2.5 rounded-xl bg-transparent hover:bg-[#18181B] flex items-center gap-3 text-xs font-semibold text-[#F5F5F7] transition-all cursor-pointer"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center text-[8px] font-bold text-white">
                              Ξ
                            </div>
                            <span>Ethereum</span>
                          </button>

                          <button
                            onClick={() => router.push(`/account?id=${safe.id}&chain=avalanche`)}
                            className="w-full p-2.5 rounded-xl bg-transparent hover:bg-[#18181B] flex items-center gap-3 text-xs font-semibold text-[#F5F5F7] transition-all cursor-pointer"
                          >
                            <div className="w-5 h-5 rounded-full bg-[#E84142] flex items-center justify-center text-[8px] font-bold text-white">
                              ▲
                            </div>
                            <span>Avalanche</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Card: Set up your workspace (Vertical Stacked List - Matching Screenshot) */}
        <div className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F5F5F7]">Set up your workspace</h2>
            <button onClick={() => toast.info("Banner dismissed")} className="text-xs font-mono text-[#71717A] hover:text-[#F5F5F7] cursor-pointer">
              Dismiss
            </button>
          </div>

          {/* 4 Vertical Stacked Action Items (Matching Screenshot 100%) */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/workspace/members?tab=address-book")}
              className="w-full p-4 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                  Import your address book
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#8B8FE8] transition-colors" />
            </button>

            <button
              onClick={() => router.push("/accounts")}
              className="w-full p-4 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8]">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                  Add your accounts
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#8B8FE8] transition-colors" />
            </button>

            <button
              onClick={() => router.push("/workspace/members")}
              className="w-full p-4 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                  Invite team members
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#8B8FE8] transition-colors" />
            </button>

            <button
              onClick={() => router.push("/accounts?tab=workspaces")}
              className="w-full p-4 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8]">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                  Explore workspaces
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#8B8FE8] transition-colors" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
