"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { Wallet, Search, Bell } from "lucide-react";
import { useWallet } from "@/components/wallet-provider";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

function WorkspaceTopBar() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 border-b border-[rgba(245,245,247,0.06)] bg-[#0A0A0B]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="bg-[#111113]/80 border border-[rgba(245,245,247,0.08)] rounded-full pl-10 pr-4 py-2 text-xs text-[#F5F5F7] placeholder:text-[#71717A]/60 focus:outline-none focus:border-[#8B8FE8]/50 transition-all w-64 focus:w-80 font-mono"
          />
        </div>
      </div>

      {/* Right: Notifications & Wallet Chip */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.06)] text-[#71717A] hover:text-[#F5F5F7] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
        </button>

        {!mounted ? (
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[rgba(245,245,247,0.08)] bg-white/5 text-xs font-mono text-[#71717A]/50 select-none pointer-events-none">
            <Wallet className="w-3.5 h-3.5" />
            <span>Loading...</span>
          </button>
        ) : isConnected ? (
          <button
            onClick={() => disconnectWallet()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#8B8FE8]/30 bg-[#8B8FE8]/10 hover:bg-[#8B8FE8]/20 text-xs font-mono text-[#F5F5F7] transition-all duration-300 select-none"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[8px] font-bold text-white">
              0x
            </div>
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </button>
        ) : (
          <button
            onClick={() => connectWallet("metamask")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(245,245,247,0.08)] bg-white/5 hover:bg-white/10 text-xs font-mono text-[#71717A] hover:text-[#F5F5F7] transition-all duration-300 select-none"
          >
            <Wallet className="w-3.5 h-3.5 text-[#8B8FE8]" />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="relative min-h-screen bg-[#0A0A0B] text-[#F5F5F7] flex selection:bg-[#8B8FE8]/20 selection:text-[#8B8FE8]">
        <DottedGlowBackground
          gap={28}
          radius={1.5}
          color="rgba(245, 245, 247, 0.12)"
          glowColor="rgba(139, 143, 232, 0.5)"
          opacity={0.25}
        />

        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ml-[240px]">
          <WorkspaceTopBar />
          <main className="flex-1 relative z-10">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
