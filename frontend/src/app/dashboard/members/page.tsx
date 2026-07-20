"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, 
  Upload, 
  Download, 
  Plus, 
  Pencil, 
  Trash2, 
  Send, 
  Copy, 
  ExternalLink,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { getStoredSafes } from "@/lib/safe-storage";

interface AddressBookEntry {
  id: string;
  name: string;
  address: string;
}

function MembersPageContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams ? searchParams.get("tab") : null;
  const isAddressBook = activeTab === "address-book";

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<AddressBookEntry[]>([]);

  useEffect(() => {
    const safes = getStoredSafes();
    if (safes.length > 0 && safes[0].signers) {
      const formatted = safes[0].signers.map((s, idx) => ({
        id: `c-${idx}`,
        name: s.name,
        address: s.address.startsWith("eth:") ? s.address : `eth:${s.address}`,
      }));
      setContacts(formatted);
    }
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#F5F5F7] min-h-screen">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F7]">
          {isAddressBook ? "Address Book" : "Team & Signers"}
        </h1>
        <p className="text-xs text-[#71717A] mt-1 font-mono">
          {isAddressBook
            ? "Manage local and workspace contacts for quick multi-sig proposals."
            : "Workspace team members, signers, and threshold parameters."}
        </p>
      </div>

      {/* Local Storage Alert Banner (Matching Screenshot 4) */}
      <div className="p-4 rounded-2xl bg-[#111113]/80 border border-[rgba(245,245,247,0.06)] text-xs text-[#71717A] font-mono">
        This data is stored in your local storage. Do you want to manage your <span className="text-[#F5F5F7] font-bold">Soujanya&apos;s Workspace</span> workspace address book instead?{" "}
        <button onClick={() => toast.info("Switched to workspace contacts")} className="text-[#8B8FE8] underline cursor-pointer">
          Click here
        </button>
      </div>

      {/* Search Bar & Action Buttons Toolbar (Matching Screenshot 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search address book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113]/80 border border-[rgba(245,245,247,0.08)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F5F5F7] placeholder:text-[#71717A]/60 focus:outline-none focus:border-[#8B8FE8]/50 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.info("Import contacts JSON")}
            className="px-4 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#8B8FE8]" />
            <span>Import</span>
          </button>

          <button
            onClick={() => toast.info("Export CSV")}
            className="px-4 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#8B8FE8]" />
            <span>Export</span>
          </button>

          <button
            onClick={() => {
              const newEntry = {
                id: `c-${Date.now()}`,
                name: `New Contact ${contacts.length + 1}`,
                address: `eth:0x${Math.random().toString(16).substring(2, 10)}...`,
              };
              setContacts([...contacts, newEntry]);
              toast.success("Added new address entry");
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New entry</span>
          </button>
        </div>
      </div>

      {/* Address Book Table (Matching Screenshot 4) */}
      <div className="rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[rgba(245,245,247,0.06)] bg-[#0A0A0B]/60 text-[#71717A]">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Address</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(245,245,247,0.04)]">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-[#18181B]/50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#F5F5F7]">{contact.name}</td>
                <td className="px-6 py-4 text-[#71717A]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                      eth
                    </div>
                    <span className="text-[#F5F5F7] truncate">{contact.address}</span>
                    <Copy className="w-3.5 h-3.5 cursor-pointer hover:text-[#8B8FE8]" onClick={() => toast.success("Address copied")} />
                    <ExternalLink className="w-3.5 h-3.5 cursor-pointer hover:text-[#8B8FE8]" />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 text-[#71717A]">
                    <button className="hover:text-[#F5F5F7] p-1 rounded-lg hover:bg-[#18181B]" onClick={() => toast.info(`Edit ${contact.name}`)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-[#E84142] p-1 rounded-lg hover:bg-[#18181B]" onClick={() => setContacts(contacts.filter(c => c.id !== contact.id))}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-[#8B8FE8] p-1 rounded-lg hover:bg-[#18181B]" onClick={() => toast.info(`Sending to ${contact.name}`)}>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#71717A]">Loading...</div>}>
      <MembersPageContent />
    </Suspense>
  );
}
