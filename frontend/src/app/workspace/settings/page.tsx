"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  User,
  Info,
  Check,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Trash2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { getStoredWorkspaces, StoredWorkspace } from "@/lib/safe-storage";

export default function WorkspaceSettingsPage() {
  const [activeTab, setActiveTab] = useState<"workspace" | "user" | "about">("workspace");
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const ws = getStoredWorkspaces();
    if (ws.length > 0) {
      setWorkspaceName(ws[0].name);
    }
  }, []);

  const handleSave = () => {
    toast.success("Workspace name updated successfully");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      {/* Settings Subnav Tabs (Matching Video Frame 43-45 100%) */}
      <div className="flex items-center gap-6 border-b border-[rgba(245,245,247,0.08)] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer ${
            activeTab === "workspace"
              ? "border-[#8B8FE8] text-[#F5F5F7]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          <Building2 className="w-4 h-4 text-[#8B8FE8]" />
          <span>Workspace settings</span>
        </button>

        <button
          onClick={() => setActiveTab("user")}
          className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer ${
            activeTab === "user"
              ? "border-[#8B8FE8] text-[#F5F5F7]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>User settings</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer ${
            activeTab === "about"
              ? "border-[#8B8FE8] text-[#F5F5F7]"
              : "border-transparent text-[#71717A] hover:text-[#F5F5F7]"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>

      {activeTab === "workspace" && (
        <div className="space-y-6">
          {/* Identity Section */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-[#71717A] uppercase tracking-wider font-mono">
              Identity
            </h2>

            <div className="space-y-2">
              <label className="text-xs text-[#F5F5F7] font-semibold block">
                Workspace name
              </label>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8] font-bold text-xs shrink-0">
                  {workspaceName.charAt(0).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="flex-1 bg-[#0A0A0B] border border-[rgba(245,245,247,0.12)] focus:border-[#8B8FE8] rounded-xl px-4 py-2.5 text-xs text-[#F5F5F7] focus:outline-none font-mono"
                />
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-[#71717A] uppercase tracking-wider font-mono">
              Appearance
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
                { id: "system", label: "System", icon: Monitor },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as any)}
                    className={`p-4 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#18181B] border-[#8B8FE8] text-[#F5F5F7]"
                        : "bg-[#0A0A0B] border-[rgba(245,245,247,0.08)] text-[#71717A] hover:text-[#F5F5F7]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#8B8FE8]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manage Workspace Section */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-[#71717A] uppercase tracking-wider font-mono">
              Manage workspace
            </h2>

            <button
              onClick={() => toast.info("Left workspace")}
              className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#71717A]" />
              <span>Leave workspace</span>
            </button>
          </div>

          {/* Danger Zone Section */}
          <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[#E84142]/20 shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-[#E84142] uppercase tracking-wider font-mono">
              Danger zone
            </h2>

            <button
              onClick={() => toast.error("Workspace deleted")}
              className="px-5 py-2.5 rounded-xl bg-[#E84142]/10 hover:bg-[#E84142]/20 border border-[#E84142]/30 text-xs font-semibold text-[#E84142] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
