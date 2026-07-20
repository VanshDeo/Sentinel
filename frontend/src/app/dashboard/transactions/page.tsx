"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Search, 
  Calendar, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight,
  Clock,
  Filter,
} from "lucide-react";

export default function ActivityPage() {
  const [memberFilter, setMemberFilter] = useState("All members");
  const [sortFilter, setSortFilter] = useState("Newest first");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const activityEvents = [
    {
      id: "act-1",
      user: "Soujanya",
      avatarLetter: "S",
      action: "updated their alias",
      target: "",
      time: "Today at 9:19 PM",
      category: "Account",
    },
    {
      id: "act-2",
      user: "Soujanya",
      avatarLetter: "S",
      action: "created the workspace",
      target: "Soujanya's Workspace",
      time: "Today at 9:07 PM",
      category: "Workspace",
    },
    {
      id: "act-3",
      user: "Soujanya",
      avatarLetter: "S",
      action: "approved transfer proposal #42",
      target: "50,000 USDC",
      time: "Today at 8:45 PM",
      category: "Policy",
    },
    {
      id: "act-4",
      user: "System",
      avatarLetter: "⚡",
      action: "settled batch transaction #104",
      target: "Fuji Subnet",
      time: "Today at 7:30 PM",
      category: "Settlement",
    },
    {
      id: "act-5",
      user: "Soujanya",
      avatarLetter: "S",
      action: "linked Safe account",
      target: "Sentinel Treasury Alpha",
      time: "Yesterday at 4:15 PM",
      category: "Safe",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F7]">
          Activity
        </h1>
        <p className="text-xs text-[#71717A] mt-1 font-mono">
          Comprehensive audit log of workspace events, signatures, and batch settlements.
        </p>
      </div>

      {/* Filter Toolbar (Matching Screenshot 4) */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-3xl bg-[#111113]/80 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-lg">
        {/* Member Selector Dropdown */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#71717A]">Member</label>
          <div className="relative">
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-2xl px-4 py-2.5 pr-8 text-xs font-semibold text-[#F5F5F7] focus:outline-none focus:border-[#8B8FE8] appearance-none cursor-pointer"
            >
              <option value="All members">All members</option>
              <option value="Soujanya">Soujanya</option>
              <option value="System">System Bot</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Date From */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#71717A]">From</label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-2xl px-4 py-2 text-xs font-mono text-[#F5F5F7] focus:outline-none focus:border-[#8B8FE8]"
            />
          </div>
        </div>

        {/* Date To */}
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] uppercase font-mono text-[#71717A]">To</label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-2xl px-4 py-2 text-xs font-mono text-[#F5F5F7] focus:outline-none focus:border-[#8B8FE8]"
            />
          </div>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex flex-col space-y-1 ml-auto">
          <label className="text-[10px] uppercase font-mono text-[#71717A]">Sort</label>
          <div className="relative">
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-2xl px-4 py-2.5 pr-8 text-xs font-semibold text-[#F5F5F7] focus:outline-none focus:border-[#8B8FE8] appearance-none cursor-pointer"
            >
              <option value="Newest first">Newest first</option>
              <option value="Oldest first">Oldest first</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Activity Timeline Card */}
      <div className="p-7 rounded-3xl bg-[#111113]/80 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl space-y-4">
        {activityEvents.map((evt) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#18181B]/60 hover:bg-[#202024] border border-[rgba(245,245,247,0.04)] hover:border-[#8B8FE8]/30 flex items-center gap-4 transition-all"
          >
            {/* User Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] font-bold text-sm shrink-0">
              {evt.avatarLetter}
            </div>

            <div className="flex-1">
              <p className="text-xs text-[#F5F5F7] font-sans">
                <span className="font-bold text-[#F5F5F7]">{evt.user}</span>{" "}
                <span className="text-[#71717A]">{evt.action}</span>{" "}
                {evt.target && <span className="font-semibold text-[#8B8FE8]">{evt.target}</span>}
              </p>
              <p className="text-[10px] text-[#71717A] font-mono mt-0.5">{evt.time}</p>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.06)] text-[9px] font-mono text-[#71717A]">
              {evt.category}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
