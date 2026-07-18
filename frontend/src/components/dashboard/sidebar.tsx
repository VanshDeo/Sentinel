"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ShieldCheck,
  Building2,
  KeyRound,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { SentinelLogo } from "@/components/sentinel-logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/policies", label: "Policies", icon: ShieldCheck },
  { href: "/dashboard/treasury", label: "Treasury", icon: Building2 },
  { href: "/dashboard/audit", label: "Audit", icon: KeyRound },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#0E0E10] border-r border-[rgba(245,245,247,0.06)]"
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(245,245,247,0.06)] overflow-hidden">
        <Link href="/" className="flex items-center gap-3">
          {collapsed ? (
            <SentinelLogo size={40} iconOnly />
          ) : (
            <img
              src="/logo/logo - horizontal.png"
              alt="Sentinel Logo"
              className="h-10 md:h-20 w-auto object-contain"
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-xs uppercase tracking-widest transition-colors duration-200",
                isActive
                  ? "text-[#F5F5F7]"
                  : "text-[#71717A] hover:text-[#F5F5F7]"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#8B8FE8]/8 border border-[rgba(139,143,232,0.12)] rounded-md"
                  transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                />
              )}

              <Icon className="relative z-10 w-4 h-4 shrink-0" />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-[rgba(245,245,247,0.06)] text-[#71717A] hover:text-[#F5F5F7] transition-colors"
      >
        {collapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <PanelLeftClose className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}
