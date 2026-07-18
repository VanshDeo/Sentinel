"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Building, 
  UserCheck, 
  Activity,
  ArrowRight,
  Lock,
  KeyRound,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { ScrambleText } from "@/components/motion/scramble-text";

// Framer Motion animation presets
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
} as const;

export default function DashboardPage() {
  const { isLocked } = useDashboard();

  // SVG Chart Mock Data
  const flowPath = "M 0 80 Q 40 40 80 60 T 160 30 T 240 70 T 320 20 T 400 45 L 400 100 L 0 100 Z";
  const flowLine = "M 0 80 Q 40 40 80 60 T 160 30 T 240 70 T 320 20 T 400 45";

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-8 max-w-6xl mx-auto space-y-12 text-[#F5F5F7] min-h-screen relative"
    >
      
      {/* 1. Hero / Health Welcome */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(245,245,247,0.04)] pb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F7]">
            Good Morning, Soujanya
          </h1>
          <p className="text-sm text-[#71717A] mt-1 font-mono">
            Secure Treasury Administration Console
          </p>
        </div>

        {/* Global Health Pill */}
        <div className="flex items-center gap-3 bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] px-4 py-2 rounded-xl backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-[#8B8FE8] animate-pulse" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-[#F5F5F7]">Treasury Status: Secure</p>
            <p className="text-[#71717A] text-[10px]">Active policy enforcement · 3 pending actions</p>
          </div>
        </div>
      </motion.div>

      {/* Full-width locked banner transition */}
      <AnimatePresence mode="wait">
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-6 bg-[#8B8FE8]/5 border border-[#8B8FE8]/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(139,143,232,0.02)] overflow-hidden backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B8FE8]/5 border border-[#8B8FE8]/15 flex items-center justify-center text-[#8B8FE8]">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] font-mono">
                  Treasury Ledger Encrypted
                </p>
                <p className="text-[10px] text-[#71717A] max-w-xl">
                  Public block telemetry is masked. You can interact with simulated multi-party key shares in the Audit view or toggle decryption from the top status pill.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/audit"
              className="px-4 py-2 bg-[#8B8FE8]/10 border border-[#8B8FE8]/25 text-[#8B8FE8] text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-[#8B8FE8]/20 transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Reconstruct Keys
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Key Metrics Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Encrypted Treasury */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "rgba(139,143,232,0.2)" }}
          className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between h-36 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-[10px] tracking-widest uppercase font-mono">Encrypted Treasury</span>
            <Building className="w-4 h-4 text-[#8B8FE8]/60" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold font-mono tracking-tight text-[#F5F5F7] min-h-[32px]">
              <ScrambleText text="$1,284,500" trigger={!isLocked} scrambled={isLocked} />
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-[#8B8FE8] mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+2.3% active growth</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Pending Transfers */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "rgba(139,143,232,0.2)" }}
          className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between h-36 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-[10px] tracking-widest uppercase font-mono">Pending Transfers</span>
            <Clock className="w-4 h-4 text-[#71717A]/60" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold font-mono tracking-tight text-[#F5F5F7] min-h-[32px]">
              <ScrambleText text="12" trigger={!isLocked} scrambled={isLocked} speed={50} />
            </h2>
            <p className="text-[10px] text-[#71717A] mt-1">Next batch triggers in 18 mins</p>
          </div>
        </motion.div>

        {/* Card 3: Policy Compliance */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "rgba(139,143,232,0.2)" }}
          className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between h-36 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-[10px] tracking-widest uppercase font-mono">Policy Compliance</span>
            <Shield className="w-4 h-4 text-[#8B8FE8]/60" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold font-mono tracking-tight text-[#F5F5F7] min-h-[32px]">
              <ScrambleText text="100%" trigger={!isLocked} scrambled={isLocked} speed={60} />
            </h2>
            <p className="text-[10px] text-[#71717A] mt-1">Active rules intercepting txs</p>
          </div>
        </motion.div>

        {/* Card 4: Audit Readiness */}
        <motion.div 
          whileHover={{ y: -2, borderColor: "rgba(139,143,232,0.2)" }}
          className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between h-36 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-[10px] tracking-widest uppercase font-mono">Audit Readiness</span>
            <UserCheck className="w-4 h-4 text-[#8B8FE8]/60" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold font-mono tracking-tight text-[#F5F5F7] min-h-[32px]">
              <ScrambleText text="READY" trigger={!isLocked} scrambled={isLocked} speed={70} />
            </h2>
            <p className="text-[10px] text-[#71717A] mt-1">2/3 Shamir Keys Assigned</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Attention Center & Activity Layout */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        
        {/* Left Side: Attention Center & System Health */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Attention Center */}
          <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] space-y-4 backdrop-blur-md">
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8B8FE8]" />
              Needs Your Attention
            </h2>
            <div className="space-y-3">
              {[
                { title: "Proposal #42 awaiting signatures", desc: "USDC 50,000 to vendor address 0x9d...b1", icon: Clock },
                { title: "Vendor check warning", desc: "Recipient 0x4b...8c flagged under rule #3", icon: AlertTriangle },
                { title: "Batch settlement upcoming", desc: "6 transactions currently queued for Fuji L1 conversion", icon: CheckCircle },
                { title: "One auditor key holder inactive", desc: "Holder A has not checked in for 14 days", icon: HelpCircle }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start justify-between p-3.5 bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] rounded-xl transition-all duration-200 hover:border-[rgba(139,143,232,0.08)]">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#8B8FE8]/5 border border-[#8B8FE8]/15 flex items-center justify-center text-[#8B8FE8] shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#F5F5F7]">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#71717A] font-mono">
                          {isLocked ? <ScrambleText text={item.desc} trigger={false} scrambled /> : item.desc}
                        </p>
                      </div>
                    </div>
                    <div className="text-[10px] px-2.5 py-1 rounded-lg border uppercase tracking-wider font-semibold text-[#F5F5F7]/80 bg-white/5 border-[rgba(245,245,247,0.08)]">
                      Pending Action
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Health */}
          <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] backdrop-blur-md">
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] mb-4 font-mono">
              Sentinel Integration System Status
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Safe Connected", value: "Active" },
                { label: "eERC Converter", value: "Active" },
                { label: "Sentinel Module", value: "Active" },
                { label: "Audit Registry", value: "Synced" }
              ].map((sys, i) => (
                <div key={i} className="p-4 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] text-center space-y-1">
                  <p className="text-[10px] text-[#71717A] font-mono uppercase">{sys.label}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8B8FE8]">
                    {sys.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Activity Timeline */}
        <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(245,245,247,0.06)]">
              <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8B8FE8]" />
                Activity Timeline
              </h2>
              <Link href="/dashboard/transactions" className="text-[10px] text-[#8B8FE8] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-6 relative pl-3 border-l border-[rgba(245,245,247,0.08)]">
              {/* Event 1 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#8B8FE8] border border-[#0B0F14]" />
                <span className="text-[10px] text-[#71717A] font-mono">Today, 11:30 AM</span>
                <p className="text-xs font-semibold text-[#F5F5F7]">Batch Settled</p>
                <p className="text-[10px] text-[#71717A]">6 transfers settled in batch #104</p>
              </div>

              {/* Event 2 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#8B8FE8] border border-[#0B0F14]" />
                <span className="text-[10px] text-[#71717A] font-mono">Today, 11:00 AM</span>
                <p className="text-xs font-semibold text-[#F5F5F7]">Proposal Approved</p>
                <p className="text-[10px] text-[#71717A]">Proposal #42 passed PolicyEngine checks</p>
              </div>

              {/* Event 3 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#8B8FE8] border border-[#0B0F14]" />
                <span className="text-[10px] text-[#71717A] font-mono">Today, 10:15 AM</span>
                <p className="text-xs font-semibold text-[#F5F5F7]">Proposal Submitted</p>
                <p className="text-[10px] text-[#71717A]">New transfer proposed by lead signer</p>
              </div>

              {/* Event 4 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#71717A] border border-[#0B0F14]" />
                <span className="text-[10px] text-[#71717A] font-mono">Yesterday, 4:20 PM</span>
                <p className="text-xs font-semibold text-[#F5F5F7]">Policy Updated</p>
                <p className="text-[10px] text-[#71717A]">Treasury cap modified from 100k to 500k</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[rgba(245,245,247,0.06)] text-center">
            <span className="text-[10px] text-[#71717A] font-mono">Audit key reconstructed 2 days ago</span>
          </div>
        </div>

      </motion.div>

      {/* 4. Analytics Section */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        
        {/* Chart 1: Treasury Flow Area */}
        <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div>
            <h3 className="text-xs text-[#71717A] tracking-wider uppercase font-mono mb-1">Treasury Flow</h3>
            <p className="text-sm font-semibold text-[#F5F5F7]">Inflow vs Outflow</p>
          </div>
          <div className="h-24 w-full relative">
            <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B8FE8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B8FE8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={flowPath} fill="url(#areaGrad)" />
              <path d={flowLine} fill="none" stroke="#8B8FE8" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Chart 2: Monthly Spend Bars */}
        <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div>
            <h3 className="text-xs text-[#71717A] tracking-wider uppercase font-mono mb-1">Monthly Spend</h3>
            <p className="text-sm font-semibold text-[#F5F5F7]">Operating Expenditure</p>
          </div>
          <div className="h-24 w-full flex items-end justify-between px-2">
            {[40, 65, 30, 85, 55, 70, 95].map((height, i) => (
              <div key={i} className="w-4 bg-[#0E0E10]/30 rounded-t-md relative group h-full flex items-end">
                <div 
                  className="w-full bg-[#8B8FE8]/80 rounded-t-md hover:bg-[#8B8FE8] transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Policy Rejections Donut */}
        <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div>
            <h3 className="text-xs text-[#71717A] tracking-wider uppercase font-mono mb-1">Policy Rejections</h3>
            <p className="text-sm font-semibold text-[#F5F5F7]">Enforced Intercepts</p>
          </div>
          <div className="h-24 w-full flex items-center justify-center gap-4">
            <svg width="70" height="70" viewBox="0 0 36 36" className="transform -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(245,245,247,0.04)" strokeWidth="3" />
              {/* Passed: 80% */}
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8B8FE8" strokeWidth="2.5" 
                strokeDasharray="80 100" strokeDashoffset="0" />
              {/* Blocked: 20% */}
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(245,245,247,0.15)" strokeWidth="2.5" 
                strokeDasharray="20 100" strokeDashoffset="-80" />
            </svg>
            <div className="text-[10px] space-y-1.5 font-mono text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
                <span>Passed (84)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgba(245,245,247,0.15)]" />
                <span>Blocked (21)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Batch Efficiency Line */}
        <div className="p-6 rounded-2xl bg-[#111113]/40 border border-[rgba(245,245,247,0.06)] flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div>
            <h3 className="text-xs text-[#71717A] tracking-wider uppercase font-mono mb-1">Batch Efficiency</h3>
            <p className="text-sm font-semibold text-[#F5F5F7]">Settlement Latency</p>
          </div>
          <div className="h-24 w-full relative">
            <svg viewBox="0 0 400 100" className="w-full h-full">
              <path d="M 0 50 Q 80 80 160 30 T 320 60 T 400 20" fill="none" stroke="#8B8FE8" strokeWidth="1.5" />
              {/* Guideline */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(245,245,247,0.04)" strokeDasharray="4" />
            </svg>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
}
