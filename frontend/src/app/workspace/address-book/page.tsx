"use client";

import React, { useState } from "react";
import { Plus, Upload, BookOpen, Search } from "lucide-react";
import { toast } from "sonner";

export default function WorkspaceAddressBookPage() {
  const [activeTab, setActiveTab] = useState<"workspace" | "local" | "pending">("workspace");

  const contacts = []; // Empty state by default matching screenshot

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-[#F5F5F7] min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
        Address book
      </h1>

      {/* Subnav Tabs: Workspace contacts (0) | Local contacts (0) | Pending (0) (Matching Reference Screenshot 100%) */}
      <div className="flex items-center gap-6 border-b border-[rgba(245,245,247,0.08)] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`pb-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "workspace"
              ? "border-[#8B8FE8] text-[#F5F5F7]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          Workspace contacts ({contacts.length})
        </button>

        <button
          onClick={() => setActiveTab("local")}
          className={`pb-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "local"
              ? "border-[#8B8FE8] text-[#F5F5F7]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          Local contacts (0)
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "pending"
              ? "border-[#8B8FE8] text-[#F5F5F7]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          Pending (0)
        </button>
      </div>

      {/* Action Buttons: + Add shared contact | ↑ Import (Matching Reference Screenshot 100%) */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => toast.info("Add shared contact modal")}
          className="px-5 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add shared contact</span>
        </button>

        <button
          onClick={() => toast.info("Import contacts modal")}
          className="px-5 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 text-[#71717A]" />
          <span>Import</span>
        </button>
      </div>

      {/* Main Content Area / Empty State Card (Matching Reference Screenshot 100%) */}
      <div className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl min-h-[140px] flex items-center justify-start">
        <p className="text-xs text-[#71717A] font-mono">
          No contacts in this workspace yet.
        </p>
      </div>
    </div>
  );
}
