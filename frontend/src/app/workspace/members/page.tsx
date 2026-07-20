"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Copy,
  Users,
  BookOpen,
  Mail,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getStoredSafes } from "@/lib/safe-storage";

function WorkspaceMembersContent() {
  const searchParams = useSearchParams();
  const activeTabParam = searchParams ? searchParams.get("tab") : null;
  const isAddressBook = activeTabParam === "address-book";

  const [activeTab, setActiveTab] = useState<"team" | "address-book">(
    isAddressBook ? "address-book" : "team"
  );
  const [search, setSearch] = useState("");

  const members = [
    {
      id: "m-1",
      name: "Admin Signer",
      email: "-",
      role: "Admin",
      isYou: true,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-[#F5F5F7] min-h-screen">
      {/* Header & Primary Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
          {activeTab === "address-book" ? "Address book" : "Team"}
        </h1>

        <button
          onClick={() => toast.info(activeTab === "address-book" ? "Add contact modal" : "Invite team member modal")}
          className="px-5 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{activeTab === "address-book" ? "Add shared contact" : "Add member"}</span>
        </button>
      </div>

      {/* Main Table / Directory Card */}
      <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-4">
        {activeTab === "team" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(245,245,247,0.06)] text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  <th className="pb-3 px-4">Name</th>
                  <th className="pb-3 px-4">Email</th>
                  <th className="pb-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(245,245,247,0.04)] text-xs font-mono">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#F5F5F7] flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8] font-bold text-xs">
                        A
                      </div>
                      <span>{m.name}</span>
                      {m.isYou && (
                        <span className="px-2 py-0.5 rounded-full bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-[10px] text-[#71717A]">
                          You
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#71717A]">{m.email}</td>
                    <td className="py-4 px-4 text-[#8B8FE8] font-bold">{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-xs text-[#71717A] font-mono">No contacts in this workspace yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkspaceMembersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#71717A]">Loading...</div>}>
      <WorkspaceMembersContent />
    </Suspense>
  );
}
