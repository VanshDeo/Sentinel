"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  KeyReconstruction 
} from "@/components/dashboard/key-reconstruction";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { 
  ShieldCheck, 
  Lock, 
  Download, 
  ExternalLink,
  Search,
  AlertTriangle,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLog {
  id: string;
  timestamp: string;
  recipient: string;
  amount: string;
  policyCheck: "Passed" | "Failed";
  blockReason?: string;
  txHash: string;
}

const DECRYPTED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "tx_104",
    timestamp: "Today, 11:30 AM",
    recipient: "0x9d3f82a...b1e4",
    amount: "50,000 USDC",
    policyCheck: "Passed",
    txHash: "0xf8a2b1c...d8e5"
  },
  {
    id: "tx_103",
    timestamp: "Today, 10:15 AM",
    recipient: "0x4b7fc2d...e8b4",
    amount: "15,000 USDC",
    policyCheck: "Passed",
    txHash: "0x3b5c1d8...e9a2"
  },
  {
    id: "tx_102",
    timestamp: "Today, 09:12 AM",
    recipient: "0x7a3fc2d...e8b4",
    amount: "1,250,000 USDC",
    policyCheck: "Failed",
    blockReason: "Exceeded spending cap of $500k. Recipient unregistered.",
    txHash: "0x2c8e...f4a7"
  },
  {
    id: "tx_101",
    timestamp: "Yesterday, 4:00 PM",
    recipient: "0x2c5ed2d...e2f5",
    amount: "89,000 AVAX",
    policyCheck: "Passed",
    txHash: "0x89d2...71e4"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
} as const;

export default function AuditPage() {
  const { isLocked, setIsLocked } = useDashboard();
  const [search, setSearch] = useState("");

  const reconstructed = !isLocked;

  const filteredLogs = DECRYPTED_AUDIT_LOGS.filter(log => 
    log.recipient.toLowerCase().includes(search.toLowerCase()) || 
    (log.blockReason && log.blockReason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-8 max-w-6xl mx-auto space-y-8 bg-transparent text-[#F5F5F7] min-h-screen"
    >
      
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(245,245,247,0.04)] pb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F7]">
            Audit Command
          </h1>
          <p className="text-sm text-[#71717A] mt-1 font-mono">
            Shamir-Combined Auditor Interface & Evidence Explorer
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(245,245,247,0.06)] bg-[#111113]/40 backdrop-blur-md text-xs w-max">
          <ShieldCheck className="w-4 h-4 text-[#8B8FE8]" />
          <span className="text-[#71717A]">Audit Ready · 2/3 Keys Assigned</span>
        </div>
      </motion.div>

      {/* Shamir Key Reconstruction Panel */}
      <motion.div 
        variants={itemVariants}
        className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)]"
      >
        <KeyReconstruction onReconstructChange={(active) => setIsLocked(!active)} />
      </motion.div>

      {/* Decrypted Audit logs area */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono">
            Auditable Evidence Explorer
          </h2>
          {reconstructed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter decrypted logs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F5F5F7] focus:outline-none"
                />
              </div>
              <Button size="sm" variant="default" className="text-xs">
                <Download className="w-3 h-3 mr-1.5" />
                Export Ledger
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {reconstructed ? (
            /* Decrypted view */
            <motion.div 
              key="decrypted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[rgba(245,245,247,0.06)] bg-[#111113]/40 backdrop-blur-md overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#0E0E10]/50 border-b border-[rgba(245,245,247,0.04)] text-[#71717A] font-mono uppercase tracking-wider">
                      <th className="p-4">TX ID</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Recipient</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Policy Result</th>
                      <th className="p-4">Audit Details</th>
                      <th className="p-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(245,245,247,0.03)]">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-[#0E0E10]/20 transition-colors">
                        <td className="p-4 font-mono font-semibold text-[#8B8FE8]">{log.id}</td>
                        <td className="p-4 text-[#71717A]">{log.timestamp}</td>
                        <td className="p-4 font-mono">{log.recipient}</td>
                        <td className="p-4 font-semibold font-mono text-[#F5F5F7]">{log.amount}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider text-[#F5F5F7]/80 bg-white/5 border-[rgba(245,245,247,0.06)] flex items-center gap-1 w-max">
                            {log.policyCheck === "Passed" ? (
                              <Check className="w-3 h-3 text-[#8B8FE8]" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-[#71717A]" />
                            )}
                            {log.policyCheck}
                          </span>
                        </td>
                        <td className="p-4 text-[#71717A]">
                          {log.blockReason ? (
                            <span className="text-[#71717A] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#8B8FE8]" />
                              {log.blockReason}
                            </span>
                          ) : (
                            "Approved settlement"
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button className="p-1 rounded bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] hover:bg-[#8B8FE8]/10 hover:text-[#8B8FE8] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            /* Encrypted / Locked view */
            <motion.div 
              key="encrypted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-12 text-center bg-[#111113]/25 backdrop-blur-md border border-[rgba(245,245,247,0.06)] rounded-2xl flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-[rgba(245,245,247,0.06)] flex items-center justify-center text-[#71717A]">
                <Lock className="w-5 h-5 text-[#8B8FE8]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs uppercase tracking-widest text-[#F5F5F7] font-mono font-semibold">
                  Ledger Encrypted
                </h3>
                <p className="text-[10px] text-[#71717A] max-w-sm mx-auto leading-relaxed">
                  Sentinel uses zero-knowledge architectures to hide transaction balances. Multi-party Shamir combination of at least 2 auditor keys is required to decrypt logs.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </motion.div>
  );
}
