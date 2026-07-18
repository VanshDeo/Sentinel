"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Member {
  name: string;
  role: "Finance Lead" | "Auditor" | "Signer" | "Governance";
  wallet: string;
  status: "Active" | "Inactive";
  lastActivity: string;
  permissions: string[];
}

const MEMBERS: Member[] = [
  {
    name: "Soujanya",
    role: "Finance Lead",
    wallet: "0x7a3f...e8b4",
    status: "Active",
    lastActivity: "Just now",
    permissions: ["Manage Policies", "Initiate Proposals", "Reconstruct Audit Keys"]
  },
  {
    name: "Alex Rivera",
    role: "Signer",
    wallet: "0x9d3f...b1e4",
    status: "Active",
    lastActivity: "12 mins ago",
    permissions: ["Sign Proposals", "Submit Transfers"]
  },
  {
    name: "Dr. Elena Rostova",
    role: "Auditor",
    wallet: "0x4b7f...e8b4",
    status: "Active",
    lastActivity: "2 hours ago",
    permissions: ["Access Encrypted Ledger", "Verify Compliance Reports"]
  },
  {
    name: "Sarah Chen",
    role: "Governance",
    wallet: "0x2c5e...e2f5",
    status: "Inactive",
    lastActivity: "3 days ago",
    permissions: ["Manage Key Configurations", "Modify Safe Interceptors"]
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
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } }
} as const;

export default function MembersPage() {
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(245,245,247,0.04)] pb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F7]">
            Team & Members
          </h1>
          <p className="text-sm text-[#71717A] mt-1 font-mono">
            Treasury Multi-Signature Signers and Cryptographic Key Holders
          </p>
        </div>

        <Button size="default">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </motion.div>

      {/* Grid of Members */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {MEMBERS.map((member, i) => (
          <motion.div 
            whileHover={{ y: -2, borderColor: "rgba(139,143,232,0.2)" }}
            key={i} 
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] flex flex-col justify-between space-y-6"
          >
            {/* Top Row: User & Role info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B8FE8]/10 border border-[#8B8FE8]/25 flex items-center justify-center text-[#8B8FE8]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#F5F5F7]">{member.name}</h2>
                  <p className="text-[10px] text-[#71717A] font-mono">{member.wallet}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-[#8B8FE8] bg-[#8B8FE8]/5 border border-[#8B8FE8]/15 px-2 py-0.5 rounded uppercase tracking-wider">
                  {member.role}
                </span>
                <span className="text-[9px] text-[#71717A] block mt-1.5 font-mono">Active {member.lastActivity}</span>
              </div>
            </div>

            {/* Bottom Row: Permissions list */}
            <div className="space-y-2 border-t border-[rgba(245,245,247,0.04)] pt-4">
              <p className="text-[9px] uppercase tracking-widest text-[#71717A] font-mono">System Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {member.permissions.map((perm, idx) => (
                  <span 
                    key={idx}
                    className="text-[9px] text-[#F5F5F7]/80 bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] px-2 py-0.5 rounded"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>

    </motion.div>
  );
}
