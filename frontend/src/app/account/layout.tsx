"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Home, 
  Wallet, 
  Activity, 
  BookOpen, 
  Grid, 
  Settings, 
  Repeat, 
  Layers, 
  TrendingUp, 
  Lock, 
  Copy, 
  ExternalLink, 
  ChevronDown,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useWallet } from "@/components/wallet-provider";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { toast } from "sonner";
import { getStoredSafes } from "@/lib/safe-storage";
import { cn } from "@/lib/utils";

function AccountSidebarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const accountNavItems = [
    { href: "/account", label: "Overview", icon: Home },
    { href: "/dashboard/treasury", label: "Assets", icon: Wallet },
    { href: "/dashboard/transactions", label: "Transactions", icon: Activity },
    { href: "/dashboard/members?tab=address-book", label: "Address book", icon: BookOpen },
    { href: "/dashboard/policies", label: "Apps", icon: Grid },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const defiItems = [
    { label: "Swap", icon: Repeat },
    { label: "Bridge", icon: Layers },
    { label: "Earn", icon: TrendingUp },
    { label: "Stake", icon: Lock },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#0E0E10]/95 backdrop-blur-2xl border-r border-[rgba(245,245,247,0.06)]"
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Brand Header */}
      <div className="flex items-center px-4 h-20 border-b border-[rgba(245,245,247,0.06)] overflow-hidden shrink-0">
        <Link href="/accounts" className="flex items-center w-full">
          <img
            src="/logo/logo - horizontal.png"
            alt="Sentinel Logo"
            className="h-14 md:h-16 w-auto max-w-[200px] object-contain shrink-0"
          />
        </Link>
      </div>

      {/* Top Item: < Back Link to Workspace + Activate Now Button (Screenshot 3) */}
      {!collapsed && (
        <div className="p-3 space-y-2 border-b border-[rgba(245,245,247,0.06)]">
          <Link
            href="/workspace"
            className="flex items-center gap-2 text-xs font-semibold text-[#71717A] hover:text-[#F5F5F7] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#8B8FE8]" />
            <div className="w-5 h-5 rounded-lg bg-[#8B8FE8]/20 flex items-center justify-center text-[#8B8FE8] font-bold text-[10px]">
              S
            </div>
            <span className="truncate">My Workspace</span>
          </Link>

          <button
            onClick={() => toast.info("Activation initiated")}
            className="w-full py-2.5 rounded-xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all shadow-[0_4px_20px_rgba(139,143,232,0.25)] cursor-pointer"
          >
            Activate now
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {accountNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "text-[#F5F5F7] bg-[#1C1C20] border border-[rgba(245,245,247,0.08)] shadow-sm font-semibold"
                  : "text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#141417]"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#8B8FE8]" />
              )}
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#8B8FE8]" : "text-[#71717A]")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* DeFi Section */}
        {!collapsed && (
          <div className="pt-4 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#71717A] px-3.5 block">
              DeFi
            </span>
            {defiItems.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.label}
                  onClick={() => toast.info(`${d.label} module selected`)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#71717A] hover:text-[#F5F5F7] hover:bg-[#141417] transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#71717A]" />
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[rgba(245,245,247,0.06)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.06)] text-[#71717A] hover:text-[#F5F5F7] transition-colors cursor-pointer"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}

function AccountTopBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();

  const safeId = searchParams ? searchParams.get("id") : null;
  const activeChain = searchParams ? searchParams.get("chain") : "ethereum";
  const [showChainMenu, setShowChainMenu] = useState(false);

  const [activeSafe, setActiveSafe] = useState<{ name: string; address: string; threshold: string } | null>(null);

  useEffect(() => {
    const loaded = getStoredSafes();
    if (loaded.length > 0) {
      const match = safeId ? loaded.find((s) => s.id === safeId) : loaded[0];
      setActiveSafe(match || loaded[0]);
    } else {
      setActiveSafe(null);
    }
  }, [safeId]);

  return (
    <header className="h-20 border-b border-[rgba(245,245,247,0.06)] bg-[#0A0A0B]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Safe Account Selector & Chain Dropdown (Matching Screenshot 3) */}
      <div className="flex items-center gap-3">
        {/* Active Account Pill */}
        {activeSafe ? (
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#111113]/90 border border-[rgba(245,245,247,0.08)] shadow-md">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
              {activeSafe.threshold ? activeSafe.threshold.slice(0, 3) : "1/1"}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-[#F5F5F7] leading-none">{activeSafe.name}</h4>
              <p className="text-[10px] text-[#71717A] font-mono mt-1 flex items-center gap-1.5">
                <span>{activeSafe.address.slice(0, 6)}...{activeSafe.address.slice(-4)}</span>
                <Copy className="w-2.5 h-2.5 cursor-pointer hover:text-[#8B8FE8]" onClick={() => toast.success("Address copied")} />
                <ExternalLink className="w-2.5 h-2.5 cursor-pointer hover:text-[#8B8FE8]" />
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/accounts"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 text-xs font-semibold text-[#8B8FE8] hover:bg-[#8B8FE8]/25 transition-all"
          >
            <span>+ Create account</span>
          </Link>
        )}

        {/* Chain Switcher Dropdown Box */}
        <div className="relative">
          <button
            onClick={() => setShowChainMenu(!showChainMenu)}
            className="p-2.5 rounded-2xl bg-[#111113] border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {activeChain === "avalanche" ? (
              <div className="w-5 h-5 rounded-full bg-[#E84142]/20 border border-[#E84142]/50 flex items-center justify-center text-[9px] font-bold text-[#E84142]">
                ▲
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#627EEA]/20 border border-[#627EEA]/50 flex items-center justify-center text-[9px] font-bold text-[#627EEA]">
                Ξ
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          <AnimatePresence>
            {showChainMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute left-0 mt-2 w-44 bg-[#141417] border border-[rgba(245,245,247,0.12)] rounded-2xl p-2 shadow-2xl z-50 space-y-1"
              >
                <button
                  onClick={() => {
                    setShowChainMenu(false);
                    router.push("/account?chain=ethereum");
                  }}
                  className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-[#F5F5F7] hover:bg-[#18181B] transition-colors cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-[#627EEA]/20 flex items-center justify-center text-[8px] font-bold text-[#627EEA]">
                    Ξ
                  </div>
                  <span>Ethereum</span>
                </button>

                <button
                  onClick={() => {
                    setShowChainMenu(false);
                    router.push("/account?chain=avalanche");
                  }}
                  className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-[#F5F5F7] hover:bg-[#18181B] transition-colors cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-[#E84142]/20 flex items-center justify-center text-[8px] font-bold text-[#E84142]">
                    ▲
                  </div>
                  <span>Avalanche</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Notifications & Wallet Chip */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.06)] text-[#71717A] hover:text-[#F5F5F7] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
        </button>

        {isConnected ? (
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

export default function SafeAccountLayout({
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

        {/* Sidebar */}
        <Suspense fallback={<aside className="fixed left-0 top-0 bottom-0 z-50 w-[240px] bg-[#0E0E10]" />}>
          <AccountSidebarContent />
        </Suspense>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ml-[240px]">
          <Suspense fallback={<header className="h-20 bg-[#0A0A0B]" />}>
            <AccountTopBar />
          </Suspense>
          <main className="flex-1 relative z-10">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
