"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Plus, 
  Trash2, 
  History, 
  Cpu 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Policy {
  id: string;
  name: string;
  expression: string;
  status: "Active" | "Inactive";
  count: number;
}

const INITIAL_POLICIES: Policy[] = [
  { id: "1", name: "Global Spending Cap", expression: "IF Amount > 25,000 AND Recipient NOT Allowlisted THEN Reject", status: "Active", count: 12 },
  { id: "2", name: "Velocity Threshold", expression: "IF TransactionsPerHours > 10 THEN AlertLead", status: "Active", count: 3 },
  { id: "3", name: "Audit Key Reconstruction Limit", expression: "IF Amount > 1,000,000 THEN Require2of3Auditors", status: "Active", count: 0 },
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

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  
  // Builder state
  const [field, setField] = useState("Amount");
  const [operator, setOperator] = useState(">");
  const [value, setValue] = useState("25000");
  const [logical, setLogical] = useState("AND");
  const [secondField, setSecondField] = useState("Recipient");
  const [secondOperator, setSecondOperator] = useState("NOT");
  const [secondValue, setSecondValue] = useState("Allowlisted");
  const [action, setAction] = useState("Reject");

  const [policyName, setPolicyName] = useState("Custom Multi-Party Limit");

  const handleDelete = (id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
  };

  const handleCreate = () => {
    if (!policyName.trim()) return;
    const expression = `IF ${field} ${operator} ${value} ${logical} ${secondField} ${secondOperator} ${secondValue} THEN ${action}`;
    const newPolicy: Policy = {
      id: Date.now().toString(),
      name: policyName,
      expression,
      status: "Active",
      count: 0
    };
    setPolicies(prev => [...prev, newPolicy]);
    setPolicyName("Custom Multi-Party Limit");
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-8 max-w-6xl mx-auto space-y-8 bg-transparent text-[#F5F5F7] min-h-screen"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F7]">
          Policy Engine
        </h1>
        <p className="text-sm text-[#71717A] mt-1 font-mono">
          Visual Rule Builder & Compliance Interceptors
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Active Rules List (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8B8FE8]" />
                Active Policies
              </h2>
              <span className="text-[10px] text-[#71717A] font-mono">{policies.length} Total Rules</span>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {policies.map(policy => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    key={policy.id}
                    className="p-4 bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] rounded-xl space-y-2 transition-all duration-200 hover:border-[#8B8FE8]/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-[#F5F5F7]">{policy.name}</p>
                        <code className="text-[10px] text-[#8B8FE8] block mt-1 leading-relaxed bg-[#8B8FE8]/5 px-2 py-1 rounded border border-[#8B8FE8]/10 font-mono">
                          {policy.expression}
                        </code>
                      </div>
                      <button 
                        onClick={() => handleDelete(policy.id)}
                        className="p-1.5 text-[#71717A] hover:text-[#8B8FE8] transition-colors hover:bg-white/5 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-[#71717A] pt-2 border-t border-[rgba(245,245,247,0.03)]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B8FE8]" />
                        Active Enforcement
                      </span>
                      <span>Intercepted {policy.count} times</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Compliance History Logs */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
          >
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <History className="w-4 h-4 text-[#8B8FE8]" />
              Policy Logs & Auditable Changes
            </h2>
            <div className="space-y-4 relative pl-3 border-l border-[rgba(245,245,247,0.08)]">
              {[
                { time: "Today, 10:15 AM", user: "Admin", action: "Created rule 'Global Spending Cap'" },
                { time: "Yesterday, 3:00 PM", user: "Auditor", action: "Approved Allowlist counterparty 0x9d...b1" },
                { time: "2 days ago", user: "Lead Signer", action: "Modified cap from 100k to 500k" }
              ].map((log, i) => (
                <div key={i} className="relative space-y-0.5 text-xs">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#8B8FE8] border border-[#0B0F14]" />
                  <span className="text-[9px] text-[#71717A] font-mono">{log.time} · {log.user}</span>
                  <p className="text-xs text-[#F5F5F7]">{log.action}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Rule Builder */}
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8B8FE8]" />
              Visual Policy Builder
            </h2>
            <p className="text-[10px] text-[#71717A]">Construct conditional statements without writing code.</p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Policy Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#71717A] uppercase font-mono">Policy Identifier</label>
              <input 
                type="text"
                value={policyName}
                onChange={e => setPolicyName(e.target.value)}
                className="w-full bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#8B8FE8]/40"
              />
            </div>

            {/* Condition Row 1 */}
            <div className="p-3 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-3">
              <span className="text-[10px] text-[#8B8FE8] uppercase font-mono block">IF Condition</span>
              <div className="grid grid-cols-3 gap-2">
                <select 
                  value={field} 
                  onChange={e => setField(e.target.value)}
                  className="bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-2 py-1.5 text-[10px] text-[#F5F5F7]"
                >
                  <option value="Amount">Amount</option>
                  <option value="Recipient">Recipient</option>
                  <option value="TxCount">TxCount</option>
                </select>
                <select 
                  value={operator} 
                  onChange={e => setOperator(e.target.value)}
                  className="bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-2 py-1.5 text-[10px] text-[#F5F5F7]"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="=">=</option>
                  <option value="IS">IS</option>
                </select>
                <input 
                  type="text" 
                  value={value} 
                  onChange={e => setValue(e.target.value)}
                  className="bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-2 py-1 text-[10px] text-[#F5F5F7] focus:outline-none"
                />
              </div>
            </div>

            {/* Logical Operator */}
            <div className="flex justify-center">
              <select 
                value={logical} 
                onChange={e => setLogical(e.target.value)}
                className="bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-3 py-1 text-[10px] text-[#8B8FE8] uppercase font-mono"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>

            {/* Condition Row 2 */}
            <div className="p-3 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-3">
              <span className="text-[10px] text-[#8B8FE8] uppercase font-mono block">AND Condition</span>
              <div className="grid grid-cols-3 gap-2">
                <select 
                  value={secondField} 
                  onChange={e => setSecondField(e.target.value)}
                  className="bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-2 py-1.5 text-[10px] text-[#F5F5F7]"
                >
                  <option value="Recipient">Recipient</option>
                  <option value="Amount">Amount</option>
                  <option value="Asset">Asset</option>
                </select>
                <select 
                  value={secondOperator} 
                  onChange={e => setSecondOperator(e.target.value)}
                  className="bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-2 py-1.5 text-[10px] text-[#F5F5F7]"
                >
                  <option value="NOT">NOT</option>
                  <option value="IS">IS</option>
                  <option value="IN">IN</option>
                </select>
                <input 
                  type="text" 
                  value={secondValue} 
                  onChange={e => setSecondValue(e.target.value)}
                  className="bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-2 py-1 text-[10px] text-[#F5F5F7] focus:outline-none"
                />
              </div>
            </div>

            {/* Action */}
            <div className="p-3 bg-[#0E0E10]/30 rounded-xl border border-[rgba(245,245,247,0.03)] space-y-3">
              <span className="text-[10px] text-[#8B8FE8] uppercase font-mono block">THEN Action</span>
              <select 
                value={action} 
                onChange={e => setAction(e.target.value)}
                className="w-full bg-[#0B0F14]/40 border border-[rgba(245,245,247,0.06)] rounded-lg px-3 py-2 text-[10px] text-[#F5F5F7]"
              >
                <option value="Reject">Reject proposal immediately</option>
                <option value="AlertLead">Flag warning & alert Lead Signer</option>
                <option value="Require2of3Auditors">Require 2-of-3 audit approval</option>
              </select>
            </div>

            {/* Submit */}
            <Button onClick={handleCreate} className="w-full" size="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Policy Rule
            </Button>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
