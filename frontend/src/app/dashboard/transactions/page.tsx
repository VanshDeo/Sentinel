"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  Shield, 
  Lock, 
  Eye,
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface Proposal {
  id: string;
  amount: string;
  recipient: string;
  isRegistered: boolean;
  status: "Draft" | "Policy Check" | "Safe Approval" | "Queued" | "Batch" | "Settled" | "Blocked";
  policyResult: string;
  approvals: string;
  time: string;
  txHash?: string;
  policyNotes?: string;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "42",
    amount: "50,000 USDC",
    recipient: "0x9d3f82a...b1e4",
    isRegistered: true,
    status: "Safe Approval",
    policyResult: "Passed",
    approvals: "1 of 2 signatures",
    time: "10 mins ago",
    policyNotes: "Under global transaction cap ($500k cap). Counterparty allowlisted."
  },
  {
    id: "41",
    amount: "15,000 USDC",
    recipient: "0x4b7fc2d...e8b4",
    isRegistered: true,
    status: "Queued",
    policyResult: "Passed",
    approvals: "2 of 2 signatures",
    time: "1 hour ago",
    policyNotes: "Interception clean. Queued for next batch execution."
  },
  {
    id: "40",
    amount: "1,250,000 USDC",
    recipient: "0x7a3fc2d...e8b4",
    isRegistered: false,
    status: "Blocked",
    policyResult: "Failed",
    approvals: "0 of 2 signatures",
    time: "2 hours ago",
    policyNotes: "Blocked by Policy Engine: Rule #1 (Exceeded spending limit of $500,000 without multi-party audit setup). Recipient is unregistered."
  },
  {
    id: "39",
    amount: "89,000 AVAX",
    recipient: "0x2c5ed2d...e2f5",
    isRegistered: true,
    status: "Settled",
    policyResult: "Passed",
    approvals: "2 of 2 signatures",
    time: "Yesterday",
    txHash: "0xf8a2b1c...d8e5",
    policyNotes: "Settled in batch #103. Cryptographic privacy preserved."
  },
  {
    id: "38",
    amount: "8,500 USDC",
    recipient: "0x5d1be8b...a9e2",
    isRegistered: true,
    status: "Settled",
    policyResult: "Passed",
    approvals: "2 of 2 signatures",
    time: "2 days ago",
    txHash: "0x3b5c1d8...e9a2",
    policyNotes: "Settled in batch #102. Fully compliant."
  }
];

const STEPS = ["Draft", "Policy Check", "Safe Approval", "Queued", "Batch", "Settled"];

// Framer presets
const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function TransactionsPage() {
  const [selectedId, setSelectedId] = useState("42");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const selected = MOCK_PROPOSALS.find(p => p.id === selectedId) || MOCK_PROPOSALS[0];

  const filtered = MOCK_PROPOSALS.filter(p => {
    const matchesSearch = p.recipient.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStepIndex = (status: string) => {
    if (status === "Blocked") return 1;
    return STEPS.indexOf(status);
  };

  const selectedStepIdx = getStepIndex(selected.status);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-6xl mx-auto space-y-8 bg-transparent text-[#F5F5F7] min-h-screen"
    >
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F7]">
          Transaction Registry
        </h1>
        <p className="text-sm text-[#71717A] mt-1 font-mono">
          Private Proposal Management & Lifecycle Pipeline
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Side: Filter and Proposal List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls */}
          <div className="p-4 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search recipient or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F5F5F7] placeholder:text-[#71717A]/50 focus:outline-none focus:border-[#8B8FE8]/40 transition-colors"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {["All", "Safe Approval", "Queued", "Settled", "Blocked"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-lg border uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 ${
                    statusFilter === status
                      ? "text-[#8B8FE8] bg-[#8B8FE8]/6 border-[#8B8FE8]/25"
                      : "text-[#71717A] bg-transparent border-transparent hover:text-[#F5F5F7]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-2 max-h-[600px] overflow-y-auto pr-1"
          >
            {filtered.length === 0 ? (
              <div className="p-8 text-center bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)]">
                <p className="text-xs text-[#71717A]">No proposals found matching criteria.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isSel = item.id === selectedId;
                const Icon = item.status === "Blocked" ? AlertTriangle : item.status === "Settled" ? CheckCircle : Clock;
                return (
                  <motion.div
                    variants={listItem}
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSel 
                        ? "bg-[#111113]/60 border-[#8B8FE8]/30 shadow-[0_0_20px_rgba(139,143,232,0.03)]" 
                        : "bg-[#111113]/30 border-[rgba(245,245,247,0.04)] hover:border-[rgba(245,245,247,0.12)]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-[#F5F5F7]">Proposal #{item.id}</p>
                        <p className="text-[10px] text-[#71717A] font-mono mt-0.5">{item.recipient}</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 bg-white/5 border-[rgba(245,245,247,0.06)] text-[#F5F5F7]/85">
                        <Icon className="w-3 h-3 text-[#8B8FE8]" />
                        {item.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <p className="text-xl font-bold font-mono text-[#F5F5F7]">{item.amount}</p>
                      <span className="text-[9px] text-[#71717A] font-mono">{item.time}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

        {/* Right Side: Proposal Details and Pipeline */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-6"
            >
              
              {/* Detail Header */}
              <div className="flex justify-between items-start pb-4 border-b border-[rgba(245,245,247,0.04)]">
                <div>
                  <h3 className="text-base font-semibold text-[#F5F5F7]">Proposal Details</h3>
                  <p className="text-[10px] text-[#71717A] font-mono">ID: {selected.id} · Proposed {selected.time}</p>
                </div>
                
                <div className="flex gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded border flex items-center gap-1.5 text-[#F5F5F7]/80 bg-white/5 border-[rgba(245,245,247,0.06)]">
                    {selected.isRegistered ? <Lock className="w-3 h-3 text-[#8B8FE8]" /> : <Eye className="w-3 h-3 text-[#71717A]" />}
                    {selected.isRegistered ? "Encrypted (eERC)" : "Public ERC-20"}
                  </span>
                </div>
              </div>

              {/* Pipeline Stage Visualization */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-[#71717A] font-mono">Settlement Pipeline</p>
                
                <div className="flex items-center justify-between w-full relative py-4 px-2 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] overflow-x-auto gap-2">
                  {STEPS.map((step, idx) => {
                    const isCompleted = idx < selectedStepIdx;
                    const isCurrent = idx === selectedStepIdx;
                    const isBlocked = selected.status === "Blocked" && idx === 1;

                    return (
                      <div key={step} className="flex flex-col items-center flex-1 min-w-[70px] relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-semibold transition-all duration-300 ${
                          isBlocked
                            ? "bg-[#0E0E10]/40 border-[#71717A] text-[#71717A]"
                            : isCurrent
                            ? "bg-[#8B8FE8]/10 border-[#8B8FE8] text-[#8B8FE8] shadow-[0_0_10px_rgba(139,143,232,0.2)]"
                            : isCompleted
                            ? "bg-white/5 border-white/10 text-[#8B8FE8]"
                            : "bg-[#0B0F14]/40 border-[rgba(245,245,247,0.06)] text-[#71717A]"
                        }`}>
                          {isBlocked ? "✕" : isCompleted ? "✓" : idx + 1}
                        </div>
                        <span className={`text-[8px] tracking-wider uppercase mt-1.5 font-semibold text-center ${
                          isBlocked
                            ? "text-[#71717A]"
                            : isCurrent
                            ? "text-[#8B8FE8]"
                            : isCompleted
                            ? "text-[#8B8FE8]/80"
                            : "text-[#71717A]"
                        }`}>
                          {isBlocked ? "Blocked" : step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Core Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-1">
                  <span className="text-[10px] uppercase text-[#71717A] font-mono">Recipient Address</span>
                  <p className="text-xs font-mono text-[#F5F5F7] overflow-hidden text-ellipsis">{selected.recipient}</p>
                </div>

                <div className="p-4 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-1">
                  <span className="text-[10px] uppercase text-[#71717A] font-mono">Settlement Amount</span>
                  <p className="text-xl font-bold font-mono text-[#F5F5F7]">{selected.amount}</p>
                </div>

                <div className="p-4 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-1">
                  <span className="text-[10px] uppercase text-[#71717A] font-mono">Policy Validation</span>
                  <div className="flex items-center gap-1.5">
                    {selected.status === "Blocked" ? (
                      <XCircle className="w-3.5 h-3.5 text-[#71717A]" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B8FE8]" />
                    )}
                    <span className="text-xs font-semibold text-[#F5F5F7]">
                      {selected.policyResult}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-1">
                  <span className="text-[10px] uppercase text-[#71717A] font-mono">Safe Signatures</span>
                  <p className="text-xs font-semibold text-[#F5F5F7]">{selected.approvals}</p>
                </div>
              </div>

              {/* Policy Interceptor Explanation */}
              <div className="p-4 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8B8FE8]">
                  <Shield className="w-4 h-4" />
                  <span>Policy Engine Inspection Log</span>
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  {selected.policyNotes}
                </p>
              </div>

              {/* Blockchain Metadata */}
              {selected.txHash && (
                <div className="pt-4 border-t border-[rgba(245,245,247,0.04)] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-[#71717A] font-mono block">Settlement Tx Hash</span>
                    <span className="font-mono text-[10px] text-[#8B8FE8]">{selected.txHash}</span>
                  </div>
                  <a 
                    href={`https://subnets.avax.network/c-chain/tx/${selected.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] hover:bg-[#8B8FE8]/10 hover:text-[#8B8FE8] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
