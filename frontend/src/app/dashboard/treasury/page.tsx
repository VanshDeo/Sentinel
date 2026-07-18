"use client";

import { motion } from "framer-motion";
import { 
  Building, 
  Clock, 
  Network, 
  Zap, 
  ShieldCheck, 
  Layers 
} from "lucide-react";

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

export default function TreasuryPage() {
  const assets = [
    { name: "USD Coin", symbol: "USDC", balance: "1,120,500.00", value: "$1,120,500.00", percentage: "87.5%" },
    { name: "Avalanche", symbol: "AVAX", balance: "89,000.00", value: "$142,400.00", percentage: "11.1%" },
    { name: "Euro Coin", symbol: "EUROC", balance: "17,100.00", value: "$17,100.00", percentage: "1.4%" },
  ];

  const queuedTransfers = [
    { id: "tx_01", recipient: "0x9d3f...b1e4", amount: "12,500 USDC", method: "eERC (Encrypted)", age: "5m ago" },
    { id: "tx_02", recipient: "0x4b7f...e8b4", amount: "5,000 USDC", method: "eERC (Encrypted)", age: "12m ago" },
    { id: "tx_03", recipient: "0x2c5e...e2f5", amount: "1,200 AVAX", method: "eERC (Encrypted)", age: "18m ago" },
    { id: "tx_04", recipient: "0x89d2...71e4", amount: "25,000 USDC", method: "Public Fallback", age: "25m ago" },
  ];

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
          Treasury Command Center
        </h1>
        <p className="text-sm text-[#71717A] mt-1 font-mono">
          Safe Multisig Module Status & Asset Portfolio
        </p>
      </motion.div>

      {/* Grid 1: Status Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {[
          { label: "Safe Connected", value: "Active", icon: ShieldCheck, color: "#8B8FE8" },
          { label: "eERC Active", value: "Enabled", icon: Zap, color: "#8B8FE8" },
          { label: "Sentinel Module", value: "Armed", icon: Layers, color: "#8B8FE8" },
          { label: "Current Batch", value: "6 Transfers", icon: Network, color: "#F5F5F7" },
          { label: "Next Settlement", value: "17 Minutes", icon: Clock, color: "#F5F5F7" },
          { label: "Safe Gas Cap", value: "25 Gwei", icon: Building, color: "#71717A" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              whileHover={{ y: -2, borderColor: "rgba(139,143,232,0.2)" }}
              key={i} 
              className="p-4 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] flex flex-col justify-between h-28"
            >
              <span className="text-[9px] uppercase text-[#71717A] font-mono tracking-widest">{stat.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: stat.color }}>{stat.value}</span>
                <Icon className="w-4 h-4 text-[#71717A]/50" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Grid 2: Assets & Queued Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Assets Portfolio */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
        >
          <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono">
            Treasury Assets
          </h2>
          
          <div className="space-y-3">
            {assets.map((asset, i) => (
              <div key={i} className="p-4 bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#F5F5F7]">{asset.name}</p>
                  <p className="text-[10px] text-[#71717A] font-mono">{asset.balance} {asset.symbol}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-xs font-semibold text-[#F5F5F7]">{asset.value}</p>
                  <span className="text-[9px] font-semibold text-[#8B8FE8] bg-[#8B8FE8]/5 border border-[#8B8FE8]/15 px-1.5 py-0.5 rounded">
                    {asset.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Queued Transfers in current Batch */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-3 p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
        >
          <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono">
            Current Batch Queue
          </h2>

          <div className="space-y-3">
            {queuedTransfers.map((tx, i) => (
              <div key={i} className="p-3.5 bg-[#0E0E10]/30 border border-[rgba(245,245,247,0.03)] rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F5F5F7]">{tx.amount}</span>
                    <span className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border text-[#8B8FE8] bg-[#8B8FE8]/5 border-[#8B8FE8]/15">
                      {tx.method}
                    </span>
                  </div>
                  <p className="text-[9px] text-[#71717A] font-mono">To: {tx.recipient}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[9px] text-[#71717A] font-mono block">{tx.age}</span>
                  <div className="text-[8px] font-semibold text-[#8B8FE8] bg-[#8B8FE8]/5 border border-[#8B8FE8]/15 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Ready
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
