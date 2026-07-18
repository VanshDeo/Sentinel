"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Key, 
  Sliders, 
  Save, 
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function SettingsPage() {
  const [gasLimit, setGasLimit] = useState("25");
  const [batchTimeout, setBatchTimeout] = useState("30");
  const [explorerKey, setExplorerKey] = useState("0x4a9b...f8c2");
  const [notifications, setNotifications] = useState(true);

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
            System Settings
          </h1>
          <p className="text-sm text-[#71717A] mt-1 font-mono">
            Treasury Configuration, Modules & Interceptor Parameters
          </p>
        </div>

        <Button size="default" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Configurations
        </Button>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: General & Safe Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* General parameters */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
          >
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8B8FE8]" />
              Batch Execution Limits
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] text-[#71717A] uppercase font-mono block">Max Settlement Delay (Minutes)</label>
                <input 
                  type="number"
                  value={batchTimeout}
                  onChange={e => setBatchTimeout(e.target.value)}
                  className="w-full bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] text-[#71717A] uppercase font-mono block">Gas Execution Limit (Gwei)</label>
                <input 
                  type="number"
                  value={gasLimit}
                  onChange={e => setGasLimit(e.target.value)}
                  className="w-full bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Block Explorer integration */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
          >
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-[#8B8FE8]" />
              Explorer Integration
            </h2>

            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] text-[#71717A] uppercase font-mono block">Avalanche Subnet API Key</label>
              <input 
                type="text"
                value={explorerKey}
                onChange={e => setExplorerKey(e.target.value)}
                className="w-full bg-[#0E0E10]/40 border border-[rgba(245,245,247,0.06)] rounded-xl px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none font-mono"
              />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Security & Notifications */}
        <div className="space-y-6">
          
          {/* Notifications setting */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
          >
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <Key className="w-4 h-4 text-[#8B8FE8]" />
              Security Alerts
            </h2>

            <div className="flex items-center justify-between py-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#F5F5F7]">Policy Violation Alerts</span>
                <p className="text-[10px] text-[#71717A]">Notify lead via email on blocked txs</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                  notifications ? "bg-[#8B8FE8]" : "bg-[#71717A]/30"
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-[#F5F5F7] transition-transform duration-200 transform ${
                    notifications ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Module controls */}
          <motion.div 
            variants={itemVariants}
            className="p-6 bg-[#111113]/40 backdrop-blur-md rounded-2xl border border-[rgba(245,245,247,0.06)] space-y-4"
          >
            <h2 className="text-xs uppercase tracking-widest text-[#71717A] font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8B8FE8]" />
              Interceptor Module
            </h2>
            <div className="space-y-3">
              <p className="text-[10px] text-[#71717A] leading-relaxed">
                Sentinel Module is currently armed and intercepting proposals. Disabling the module returns the Gnosis Safe to default public signature mechanics.
              </p>
              <Button size="sm" variant="outline" className="w-full text-xs hover:bg-white/5 hover:text-[#8B8FE8] hover:border-[#8B8FE8]/30">
                Disable Sentinel Module
              </Button>
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
}
