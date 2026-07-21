"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, Suspense } from "react";
import {
  Home,
  Building2,
  BookOpen,
  Activity,
  Users,
  ShieldCheck,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown,
  Check,
  Plus,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/workspace", label: "Home", icon: Home },
  { href: "/workspace/accounts", label: "Accounts", icon: Building2 },
  { href: "/workspace/address-book", label: "Address book", icon: BookOpen },
  { href: "/workspace/transactions", label: "Activity", icon: Activity },
  { href: "/workspace/members", label: "Team", icon: Users },
  { href: "/workspace/policies", label: "Security hub", icon: ShieldCheck },
  { href: "/workspace/settings", label: "Settings", icon: Settings },
];

function SidebarNavContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get("tab") : null;

  const [collapsed, setCollapsed] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("My Workspace");

  const workspaces = [
    { id: "ws-1", name: "My Workspace", type: "Workspace" },
    { id: "ws-2", name: "Treasury Ops Alpha", type: "Workspace" },
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
          {collapsed ? (
            <img
              src="/logo/logo - horizontal.png"
              alt="Sentinel Logo"
              className="h-10 w-auto object-contain shrink-0"
            />
          ) : (
            <img
              src="/logo/logo - horizontal.png"
              alt="Sentinel Logo"
              className="h-14 md:h-16 w-auto max-w-[200px] object-contain shrink-0"
            />
          )}
        </Link>
      </div>

      {/* Workspace Switcher Item & Interactive Dropdown (No Green - Periwinkle Accent) */}
      {!collapsed && (
        <div className="relative px-3 py-2 my-1">
          <button
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="w-full flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-[#18181B] transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8] font-bold text-xs shrink-0">
                S
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-[#F5F5F7] truncate group-hover:text-[#8B8FE8] transition-colors">
                  {selectedWorkspace}
                </p>
                <p className="text-[10px] text-[#71717A] font-mono">Workspace</p>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-[#71717A] shrink-0" />
          </button>

          {/* Interactive Dropdown Popup */}
          <AnimatePresence>
            {showWorkspaceDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute left-2 top-full mt-1 w-60 bg-[#141417] border border-[rgba(245,245,247,0.12)] rounded-2xl p-2 shadow-2xl z-50 space-y-1"
              >
                <span className="text-[10px] uppercase tracking-wider font-mono text-[#71717A] px-2 py-1 block">
                  Workspaces
                </span>

                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws.name);
                      setShowWorkspaceDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      selectedWorkspace === ws.name
                        ? "bg-[#1C1C20] text-[#F5F5F7]"
                        : "hover:bg-[#18181B] text-[#71717A] hover:text-[#F5F5F7]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8] font-bold text-xs shrink-0">
                        S
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-[#F5F5F7] truncate">{ws.name}</p>
                        <p className="text-[9px] text-[#71717A] font-mono">{ws.type}</p>
                      </div>
                    </div>
                    {selectedWorkspace === ws.name && (
                      <Check className="w-4 h-4 text-[#F5F5F7] shrink-0 ml-1" />
                    )}
                  </button>
                ))}

                <div className="border-t border-[rgba(245,245,247,0.06)] my-1" />

                <button
                  onClick={() => {
                    setShowWorkspaceDropdown(false);
                    router.push("/accounts?tab=workspaces");
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#F5F5F7] hover:bg-[#18181B] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#8B8FE8]" />
                  <span>Add new workspace</span>
                </button>

                <button
                  onClick={() => {
                    setShowWorkspaceDropdown(false);
                    router.push("/accounts?tab=workspaces");
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#F5F5F7] hover:bg-[#18181B] transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-[#8B8FE8]" />
                  <span>View all</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href.includes("?tab=address-book")
            ? (pathname === "/dashboard/members" && currentTab === "address-book")
            : item.href === "/dashboard/members"
            ? (pathname === "/dashboard/members" && currentTab !== "address-book")
            : pathname === item.href;

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

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status & Collapse Toggle */}
      <div className="p-3 border-t border-[rgba(245,245,247,0.06)] space-y-2">
        {!collapsed && (
          <div className="p-3 rounded-2xl bg-[#111113] border border-[rgba(245,245,247,0.04)] space-y-1.5 text-[10px] font-mono text-[#71717A]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8] animate-pulse" />
                <span>eERC Module</span>
              </span>
              <span className="text-[#8B8FE8]">v1.4</span>
            </div>
          </div>
        )}

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

export function Sidebar() {
  return (
    <Suspense fallback={<aside className="fixed left-0 top-0 bottom-0 z-50 w-[240px] bg-[#0E0E10]" />}>
      <SidebarNavContent />
    </Suspense>
  );
}
