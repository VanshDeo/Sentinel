"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Plus,
  Lock,
  Building2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getStoredSafes } from "@/lib/safe-storage";

export default function WorkspaceSecurityPage() {
  const router = useRouter();
  const safes = getStoredSafes();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-[#F5F5F7] min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
        Security hub
      </h1>

      {/* Top Banner Card: No accounts to check yet (Matching Video Frame 40-42 100%) */}
      <div className="p-10 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8]">
          <Shield className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#F5F5F7]">
            No accounts to check yet
          </h3>
          <p className="text-xs text-[#71717A] max-w-md leading-relaxed font-sans">
            Add a Safe account to this workspace to start running security checks and see its health here.
          </p>
        </div>

        <button
          onClick={() => router.push("/accounts")}
          className="px-5 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer mt-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add account</span>
        </button>
      </div>

      {/* Available Security Integrations Section */}
      <div className="space-y-3 pt-4">
        <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider block">
          AVAILABLE ON EVERY SAFE YOU ADD
        </span>

        <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl max-w-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#45D6A7]/15 border border-[#45D6A7]/30 flex items-center justify-center text-[#45D6A7] font-bold">
              ⚡
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-[10px] font-mono text-[#71717A]">
              ENTERPRISE
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#F5F5F7]">
              Hypernative Guardian
            </h4>
            <p className="text-xs text-[#71717A] mt-0.5">
              Block risky transactions automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
