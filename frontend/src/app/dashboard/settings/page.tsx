"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sliders, 
  User, 
  Info, 
  LogOut, 
  Pencil, 
  ExternalLink, 
  Shield, 
  Key, 
  Server, 
  SlidersHorizontal,
  CheckCircle2,
  Copy,
  Plus,
  FileSpreadsheet,
} from "lucide-react";
import { useWallet } from "@/components/wallet-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getStoredSafes } from "@/lib/safe-storage";

export default function SettingsPage() {
  const router = useRouter();
  const { address, disconnectWallet } = useWallet();

  const [activeTab, setActiveTab] = useState<"setup" | "appearance" | "security" | "notifications" | "modules" | "safeapps" | "data" | "env">("setup");

  const [signers, setSigners] = useState<{ id: string; name: string; address: string }[]>([]);

  useEffect(() => {
    const safes = getStoredSafes();
    if (safes.length > 0 && safes[0].signers) {
      setSigners(safes[0].signers);
    } else if (address) {
      setSigners([{ id: "1", name: "Primary Owner", address: address }]);
    }
  }, [address]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      
      {/* Settings Sub-Navigation Bar (Matching Screenshot 5) */}
      <div className="flex items-center gap-6 border-b border-[rgba(245,245,247,0.08)] pb-3 text-xs font-semibold overflow-x-auto font-mono">
        {[
          { id: "setup", label: "Setup" },
          { id: "appearance", label: "Appearance" },
          { id: "security", label: "Security" },
          { id: "notifications", label: "Notifications" },
          { id: "modules", label: "Modules" },
          { id: "safeapps", label: "Safe Apps" },
          { id: "data", label: "Data" },
          { id: "env", label: "Environment variables" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "border-[#8B8FE8] text-[#8B8FE8]"
                : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Settings Content */}
      <div className="space-y-6">
        
        {/* SETUP TAB (Matching Screenshot 5) */}
        {activeTab === "setup" && (
          <div className="space-y-6">
            
            {/* Top 2 Grid Cards: Nonce & Contract Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Safe Account Nonce */}
              <div className="p-7 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl space-y-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#F5F5F7]">Safe account nonce</h3>
                  <Info className="w-3.5 h-3.5 text-[#71717A]" />
                </div>
                <p className="text-xs font-mono text-[#71717A]">
                  Current nonce: <span className="text-[#F5F5F7] font-bold">0</span>
                </p>
              </div>

              {/* Card 2: Contract Version */}
              <div className="p-7 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-[#F5F5F7]">Contract version</h3>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F5F5F7] font-bold">1.4.1</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#8B8FE8]/15 text-[#8B8FE8] border border-[#8B8FE8]/30 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Latest version
                    </span>
                  </div>
                  <a href="/docs" className="text-[#8B8FE8] hover:underline flex items-center gap-1">
                    <span>View release</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

            {/* Card 3: Members & Signers Section (Matching Screenshot 5) */}
            <div className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(245,245,247,0.06)] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#F5F5F7]">Members</h2>
                </div>

                <button
                  onClick={() => toast.success("Exported signers CSV")}
                  className="text-xs font-mono text-[#8B8FE8] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export as CSV</span>
                </button>
              </div>

              {/* Signers Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#F5F5F7]">Signers</h3>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Signers have full control over the account, they can propose, sign and execute transactions, as well as reject them.
                </p>

                {/* Signers Rows */}
                <div className="space-y-3 font-mono text-xs pt-2">
                  {signers.map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl bg-[#18181B]/80 border border-[rgba(245,245,247,0.06)] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                          eth
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-[#F5F5F7]">{s.name}</h4>
                          <p className="text-[10px] text-[#71717A] truncate flex items-center gap-1.5">
                            <span>{s.address}</span>
                            <Copy className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" onClick={() => toast.success("Address copied")} />
                            <ExternalLink className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" />
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposers Section */}
              <div className="space-y-4 pt-4 border-t border-[rgba(245,245,247,0.06)]">
                <h3 className="text-sm font-bold text-[#F5F5F7]">Proposers</h3>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Proposers can suggest transactions but cannot approve or execute them. Signers should review and approve transactions first.{" "}
                  <a href="/docs" className="text-[#8B8FE8] underline flex-inline items-center gap-1">
                    Learn more ↗
                  </a>
                </p>

                <button
                  onClick={() => toast.info("Add proposer modal")}
                  className="text-xs font-mono text-[#8B8FE8] hover:underline flex items-center gap-1.5 cursor-pointer pt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add proposer</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
