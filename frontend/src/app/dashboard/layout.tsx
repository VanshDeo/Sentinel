"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardProvider, useDashboard } from "@/components/dashboard/dashboard-context";
import { Lock, Unlock, Wallet } from "lucide-react";
import { CircuitGrid } from "@/components/circuit-grid";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function DashboardTopBar() {
  const { isLocked, setIsLocked } = useDashboard();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 border-b border-[rgba(245,245,247,0.04)] bg-[#0A0A0B]/85 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Treasury Name, address and Network Badge */}
      <div className="flex items-center gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#71717A]">Active Treasury</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B8FE8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8B8FE8]"></span>
            </span>
            <span className="text-[10px] text-[#8B8FE8] font-mono border-l border-[rgba(245,245,247,0.08)] pl-2">
              Fuji Subnet
            </span>
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-[#F5F5F7]/80">
            SENTINEL_TREASURY_0x7a3fc2d...e8b4
          </p>
        </div>
      </div>

      {/* Right: Connect Wallet & Lock/Unlock toggle pill */}
      <div className="flex items-center gap-3">
        {!mounted ? (
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(245,245,247,0.08)] bg-white/5 text-xs font-mono text-[#71717A]/50 select-none pointer-events-none">
            <Wallet className="w-3.5 h-3.5" />
            <span>Loading...</span>
          </button>
        ) : isConnected ? (
          <button
            onClick={() => disconnect()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8B8FE8]/25 bg-[#8B8FE8]/5 hover:bg-[#8B8FE8]/10 text-xs font-mono text-[#8B8FE8] transition-all duration-300 select-none"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
              if (injectedConnector) {
                connect({ connector: injectedConnector });
              } else {
                alert("No Web3 wallet connector detected. Please install MetaMask or another browser extension.");
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(245,245,247,0.08)] bg-white/5 hover:bg-white/10 text-xs font-mono text-[#71717A] hover:text-[#F5F5F7] transition-all duration-300 select-none"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Connect Wallet</span>
          </button>
        )}

        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 relative overflow-hidden group select-none ${
            isLocked
              ? "bg-white/5 border-[rgba(245,245,247,0.08)] text-[#71717A] hover:bg-white/10 hover:border-[rgba(245,245,247,0.15)]"
              : "bg-[#8B8FE8]/5 border-[#8B8FE8]/25 text-[#8B8FE8] hover:bg-[#8B8FE8]/10 hover:border-[#8B8FE8]/40"
          }`}
        >
          {/* Pulsing indicator */}
          <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? "bg-[#71717A] animate-pulse" : "bg-[#8B8FE8]"}`} />
          
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypted</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5" />
              <span>Decrypted</span>
            </>
          )}

          {/* Shine effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>
    </header>
  );
}


function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex overflow-hidden">
      {/* Sidebar - fixed */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen relative overflow-y-auto">
        {/* Background circuit grid */}
        <CircuitGrid className="opacity-60" />

        <DashboardTopBar />
        
        {/* Main content wrapper on top of background */}
        <main className="flex-1 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <LayoutContent>{children}</LayoutContent>
    </DashboardProvider>
  );
}
