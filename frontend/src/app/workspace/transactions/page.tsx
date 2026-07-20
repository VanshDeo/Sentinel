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
  Filter,
} from "lucide-react";

export default function WorkspaceActivityPage() {
  const [memberFilter, setMemberFilter] = useState("All members");
  const [sortFilter, setSortFilter] = useState("Newest first");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const activityEvents = [
    {
      id: "act-1",
      user: "Admin Signer",
      avatarLetter: "A",
      action: "created the workspace",
      target: "My Workspace",
      time: "Today at 1:53 AM",
      category: "Workspace",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-[#F5F5F7] min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
        Activity
      </h1>

      {/* Filters Bar (Matching Video Frame 34-35 100%) */}
      <div className="p-4 rounded-2xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#71717A]">Member:</span>
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-xl px-3 py-1.5 text-[#F5F5F7] focus:outline-none cursor-pointer"
          >
            <option value="All members">All members</option>
            <option value="Admin Signer">Admin Signer</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#71717A]">From:</span>
          <input
            type="text"
            placeholder="dd-mm-yyyy"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-xl px-3 py-1.5 text-[#F5F5F7] placeholder:text-[#71717A]/60 w-32 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#71717A]">To:</span>
          <input
            type="text"
            placeholder="dd-mm-yyyy"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-xl px-3 py-1.5 text-[#F5F5F7] placeholder:text-[#71717A]/60 w-32 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[#71717A]">Sort:</span>
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="bg-[#18181B] border border-[rgba(245,245,247,0.12)] rounded-xl px-3 py-1.5 text-[#F5F5F7] focus:outline-none cursor-pointer"
          >
            <option value="Newest first">Newest first</option>
            <option value="Oldest first">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-4">
        {activityEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-2xl bg-[#18181B]/60 border border-[rgba(245,245,247,0.06)] flex items-center justify-between gap-4 font-mono text-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8] font-bold text-xs shrink-0">
                {evt.avatarLetter}
              </div>

              <div>
                <p className="text-[#F5F5F7] font-sans text-xs">
                  <span className="font-bold">{evt.user}</span>{" "}
                  <span className="text-[#71717A]">{evt.action}</span>{" "}
                  <span className="font-bold text-[#8B8FE8]">{evt.target}</span>
                </p>
                <p className="text-[10px] text-[#71717A]/70 mt-0.5">{evt.time}</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.08)] text-[10px] text-[#71717A]">
              {evt.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
