"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/wallet-provider";
import {
  Plus,
  Search,
  Upload,
  Bell,
  ChevronDown,
  Lock,
  ArrowRight,
  Shield,
  Info,
  X,
  Building2,
  LogOut,
  Mail,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Code,
  Sparkles,
  Send,
  TrendingUp,
  Repeat,
  CheckCircle2,
  UserPlus,
  Check,
  MoreVertical,
  User,
  LayoutGrid,
  ChevronUp,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { SentinelLogo } from "@/components/sentinel-logo";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { toast } from "sonner";
import { getStoredSafes, saveStoredSafe } from "@/lib/safe-storage";

interface SafeAccount {
  id: string;
  name: string;
  address: string;
  network: string;
  threshold: string;
  balance: string;
  isRegistered: boolean;
}

interface TeamMemberInvite {
  id: string;
  identifier: string;
  role: "Admin" | "Member" | "Signer";
}

interface SignerRow {
  id: string;
  name: string;
  address: string;
}

function AccountsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected, disconnectWallet, requestWorkspaceSignature } = useWallet();

  const initialTab = searchParams.get("tab") === "workspaces" ? "workspaces" : "accounts";
  const [activeTab, setActiveTab] = useState<"accounts" | "workspaces">(initialTab);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [showManageSafesModal, setShowManageSafesModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newlyCreatedSafe, setNewlyCreatedSafe] = useState<SafeAccount | null>(null);

  // Wizard state: null (directory), 1, 2, 3, 4 (Workspace Wizard)
  const [workspaceStep, setWorkspaceStep] = useState<number | null>(null);

  // Create Safe Account Wizard State (1: Basics, 2: Signers, 3: Review - Screenshots 1 & 2)
  const [createSafeStep, setCreateSafeStep] = useState<number | null>(null);
  const [createSafeName, setCreateSafeName] = useState("My Account");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["Ethereum"]);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showThresholdDropdown, setShowThresholdDropdown] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"now" | "later">("later");

  const availableNetworks = [
    "Ethereum",
    "Avalanche Fuji Subnet",
    "Base",
    "Gnosis Chain",
    "Polygon",
    "Arbitrum",
  ];

  // Dynamic Signers for Create Safe Step 2 (Matching Screenshots 1 & 2)
  const connectedAddr = address || "0x7e7df9C39CCAeab8D99739fOEBC496e83c77bBEa";
  const [signers, setSigners] = useState<SignerRow[]>([
    { id: "1", name: "Admin Signer", address: connectedAddr },
    { id: "2", name: "Signer 2", address: "0xecb87B3b00daADa1725bA46DF3411524f202COC8" },
    { id: "3", name: "Signer 3", address: "0x918717e84f6bd07A2fd356c8Dc398bB6A36dDeBD" },
  ]);
  const [threshold, setThreshold] = useState("2");

  // Workspace Wizard States
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedSafeIds, setSelectedSafeIds] = useState<string[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamMemberInvite[]>([
    { id: "1", identifier: "", role: "Member" },
  ]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  useEffect(() => {
    if (searchParams.get("tab") === "workspaces") {
      setActiveTab("workspaces");
    }
  }, [searchParams]);

  // Dynamic Safes List State from Local Storage
  const [safes, setSafes] = useState<SafeAccount[]>([]);

  useEffect(() => {
    const loaded = getStoredSafes();
    setSafes(loaded);
  }, []);

  // Workspaces List
  const [userWorkspaces, setUserWorkspaces] = useState([
    {
      id: "ws-1",
      name: "Soujanya's Workspace",
      accountsCount: safes.length,
      membersCount: 1,
      avatarLetter: "S",
    },
  ]);

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "0x7e7d...bBEa";

  const filteredSafes = safes.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic Safe Deployment Creation (Triggers Success Modal - Screenshot 2)
  const handleDeployNewSafe = () => {
    if (!createSafeName.trim()) return;

    const generatedAddress = `0x6E544c305Db57109283314e799C267D527cB279B`;
    const newSafeObj = {
      id: `safe-${Date.now()}`,
      name: createSafeName,
      address: generatedAddress,
      network: selectedNetworks.join(", ") || "Ethereum",
      networks: selectedNetworks,
      threshold: `${threshold} of ${signers.length} Signers`,
      balance: "$0.00",
      signers: signers,
      isRegistered: true,
      createdAt: Date.now(),
    };

    saveStoredSafe(newSafeObj);
    setSafes([newSafeObj, ...safes]);
    setNewlyCreatedSafe(newSafeObj);
    setCreateSafeStep(null);
    setShowSuccessModal(true);
  };

  const handleAddSignerRow = () => {
    const nextIdx = signers.length + 1;
    setSigners([
      ...signers,
      {
        id: Date.now().toString(),
        name: `Signer ${nextIdx}`,
        address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      },
    ]);
  };

  const handleDeleteSignerRow = (id: string) => {
    if (signers.length <= 1) {
      toast.error("At least 1 signer is required");
      return;
    }
    const updated = signers.filter((s) => s.id !== id);
    setSigners(updated);
    if (parseInt(threshold) > updated.length) {
      setThreshold(updated.length.toString());
    }
  };

  const toggleNetworkSelection = (net: string) => {
    if (selectedNetworks.includes(net)) {
      if (selectedNetworks.length > 1) {
        setSelectedNetworks(selectedNetworks.filter((n) => n !== net));
      }
    } else {
      setSelectedNetworks([...selectedNetworks, net]);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0A0B] text-[#F5F5F7] flex flex-col overflow-x-hidden selection:bg-[#8B8FE8]/20 selection:text-[#8B8FE8]">
      {/* Background Matrix */}
      <DottedGlowBackground
        gap={28}
        radius={1.5}
        color="rgba(245, 245, 247, 0.12)"
        glowColor="rgba(139, 143, 232, 0.5)"
        opacity={0.25}
      />

      {/* Top Navigation Header */}
      <header className="relative z-20 w-full h-20 px-8 border-b border-[rgba(245,245,247,0.06)] bg-[#0A0A0B]/80 backdrop-blur-xl flex items-center justify-between">
        <Link href="/workspace" className="flex items-center">
          <img
            src="/logo/logo - horizontal.png"
            alt="Sentinel Logo"
            className="h-14 md:h-16 w-auto object-contain max-h-16"
          />
        </Link>

        {/* User Account Bar */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-2xl bg-[#111113] border border-[rgba(245,245,247,0.06)] text-[#71717A] hover:text-[#F5F5F7] transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B8FE8]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#111113] border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 transition-colors text-xs font-mono text-[#F5F5F7]"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[10px] font-bold text-white">
                0x
              </div>
              <span>{displayAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-48 bg-[#111113] border border-[rgba(245,245,247,0.08)] rounded-2xl p-2 shadow-2xl z-50 space-y-1"
                >
                  <button
                    onClick={() => {
                      disconnectWallet();
                      router.push("/onboarding");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#E84142] hover:bg-[#E84142]/10 flex items-center gap-2 transition-colors font-mono"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-6 max-w-6xl mx-auto w-full">
        
        {/* Top Controller Bar */}
        {createSafeStep === null && workspaceStep === null && (
          <div className={`w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-8 ${activeTab === "workspaces" ? "justify-center" : ""}`}>
            <div className="p-1 bg-[#111113] border border-[rgba(245,245,247,0.08)] rounded-2xl flex items-center shadow-lg">
              <button
                onClick={() => setActiveTab("accounts")}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "accounts"
                    ? "bg-[#1C1C1F] text-[#F5F5F7] shadow-md"
                    : "text-[#71717A] hover:text-[#F5F5F7]"
                }`}
              >
                Accounts
              </button>
              <button
                onClick={() => setActiveTab("workspaces")}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "workspaces"
                    ? "bg-[#1C1C1F] text-[#F5F5F7] shadow-md"
                    : "text-[#71717A] hover:text-[#F5F5F7]"
                }`}
              >
                Workspaces
              </button>
            </div>

            {activeTab === "accounts" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#111113] hover:bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-semibold text-[#F5F5F7] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8B8FE8]" />
                  <span>Add</span>
                </button>

                <button
                  onClick={() => setShowManageSafesModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Manage accounts</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: ACCOUNTS LIST / EMPTY STATE */}
        {activeTab === "accounts" && createSafeStep === null && workspaceStep === null && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full relative mb-8">
              <Search className="w-4 h-4 text-[#71717A] absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search for safes or accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111113]/60 backdrop-blur-md border border-[rgba(245,245,247,0.06)] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#F5F5F7] placeholder:text-[#71717A]/60 focus:outline-none focus:border-[#8B8FE8]/50 transition-colors font-mono"
              />
            </div>

            {filteredSafes.length > 0 ? (
              <div className="w-full space-y-4">
                {filteredSafes.map((safe) => (
                  <motion.div
                    key={safe.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-[#111113]/80 backdrop-blur-xl border border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-[#0A0A0B] border border-[rgba(245,245,247,0.06)]">
                        <Building2 className="w-5 h-5 text-[#8B8FE8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-[#F5F5F7]">{safe.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#8B8FE8]/10 text-[9px] font-mono text-[#8B8FE8] border border-[#8B8FE8]/20 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> eERC Encrypted
                          </span>
                        </div>
                        <p className="text-xs text-[#71717A] font-mono mt-0.5">
                          {safe.address} · {safe.network} ({safe.threshold})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-[rgba(245,245,247,0.04)]">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-mono text-[#71717A] block">Vault Balance</span>
                        <span className="text-sm font-bold font-mono text-[#F5F5F7]">{safe.balance}</span>
                      </div>

                      <button
                        onClick={() => router.push("/dashboard")}
                        className="px-4 py-2 rounded-xl bg-[#8B8FE8]/10 hover:bg-[#8B8FE8] text-[#8B8FE8] hover:text-[#0A0A0B] border border-[#8B8FE8]/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full p-16 rounded-3xl bg-[#111113]/80 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] flex flex-col items-center justify-center text-center space-y-4 shadow-xl my-4">
                <div className="w-16 h-16 rounded-full bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 flex items-center justify-center text-[#8B8FE8]">
                  <Wallet className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F5F5F7]">No accounts yet</h3>
                  <p className="text-xs text-[#71717A] max-w-xs leading-relaxed mt-1 font-sans">
                    Add your Safe accounts to view balances and manage transactions.
                  </p>
                </div>

                <button
                  onClick={() => setShowManageSafesModal(true)}
                  className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Manage accounts</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* CREATE NEW SAFE ACCOUNT WIZARD */}
        {createSafeStep !== null && (
          <div className="w-full space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F7]">
              Create new Safe account
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Form Panel */}
              <div className="lg:col-span-2 p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-8">
                
                {/* STEP 1: SET UP THE BASICS */}
                {createSafeStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#8B8FE8] text-[#0A0A0B] font-bold text-xs flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#F5F5F7]">Set up the basics</h2>
                        <p className="text-xs text-[#71717A]">
                          Give a name to your account and select which networks to deploy it on.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-[#71717A] block">Name</label>
                      <input
                        type="text"
                        value={createSafeName}
                        onChange={(e) => setCreateSafeName(e.target.value)}
                        placeholder="e.g. Vigorous Ethereum Safe"
                        className="w-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.14)] focus:border-[#8B8FE8] rounded-2xl px-5 py-4 text-sm text-[#F5F5F7] focus:outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-xs font-semibold text-[#F5F5F7] block">Select Networks</label>
                      <p className="text-[11px] text-[#71717A]">Choose which networks you want your account to be active on.</p>

                      <div
                        onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                        className="w-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.14)] hover:border-[#8B8FE8]/50 rounded-2xl px-4 py-3 min-h-[50px] flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          {selectedNetworks.map((net) => (
                            <span key={net} className="px-3 py-1 rounded-xl bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs text-[#F5F5F7] font-semibold flex items-center gap-1.5">
                              <span>{net}</span>
                              <X onClick={(e) => { e.stopPropagation(); toggleNetworkSelection(net); }} className="w-3 h-3 text-[#71717A] hover:text-[#F5F5F7]" />
                            </span>
                          ))}
                        </div>
                        {showNetworkDropdown ? <ChevronUp className="w-4 h-4 text-[#71717A]" /> : <ChevronDown className="w-4 h-4 text-[#71717A]" />}
                      </div>

                      <AnimatePresence>
                        {showNetworkDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-[#141417] border border-[rgba(245,245,247,0.12)] rounded-2xl p-2 shadow-2xl z-50 space-y-1 max-h-56 overflow-y-auto"
                          >
                            {availableNetworks.map((net) => {
                              const isSelected = selectedNetworks.includes(net);
                              return (
                                <div
                                  key={net}
                                  onClick={() => toggleNetworkSelection(net)}
                                  className={`p-3 rounded-xl flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors ${
                                    isSelected ? "bg-[#1C1C20] text-[#F5F5F7]" : "hover:bg-[#18181B] text-[#71717A] hover:text-[#F5F5F7]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                                      isSelected ? "bg-[#8B8FE8] border-[#8B8FE8] text-black" : "border-[#71717A]/40"
                                    }`}>
                                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span>{net}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-[11px] text-[#71717A] font-mono">
                      By continuing, you agree to our <a href="/docs" className="text-[#8B8FE8] underline">terms of use</a> and <a href="/docs" className="text-[#8B8FE8] underline">privacy policy</a>.
                    </p>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setCreateSafeStep(null)}
                        className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#71717A] hover:text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => setCreateSafeStep(2)}
                        className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.25)]"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SIGNERS AND CONFIRMATIONS */}
                {createSafeStep === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#8B8FE8] text-[#0A0A0B] font-bold text-xs flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#F5F5F7]">Signers and confirmations</h2>
                        <p className="text-xs text-[#71717A]">
                          Set the signer wallets of your Safe account and how many need to confirm to execute a valid transaction.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {signers.map((signer, idx) => (
                        <div key={signer.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="text-[10px] text-[#71717A] uppercase font-mono block mb-1">Signer name</label>
                            <input
                              type="text"
                              value={signer.name}
                              onChange={(e) => {
                                const updated = [...signers];
                                updated[idx].name = e.target.value;
                                setSigners(updated);
                              }}
                              className="w-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.12)] focus:border-[#8B8FE8] rounded-2xl px-4 py-3 text-xs text-[#F5F5F7] focus:outline-none"
                            />
                            {idx === 0 && (
                              <p className="text-[10px] text-[#71717A] font-mono mt-1">Your connected wallet</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#18181B]/80 border border-[rgba(245,245,247,0.08)] rounded-2xl px-4 py-3 flex items-center gap-3 overflow-hidden">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                                eth
                              </div>
                              <span className="text-xs font-mono text-[#F5F5F7] truncate">{signer.address}</span>
                            </div>

                            {idx > 0 && (
                              <button
                                onClick={() => handleDeleteSignerRow(signer.id)}
                                className="p-3 rounded-2xl bg-[#18181B] hover:bg-[#E84142]/10 border border-[rgba(245,245,247,0.06)] hover:border-[#E84142]/40 text-[#71717A] hover:text-[#E84142] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={handleAddSignerRow}
                        className="text-xs font-semibold text-[#8B8FE8] hover:underline flex items-center gap-1.5 pt-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add new signer</span>
                      </button>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-[rgba(245,245,247,0.06)] relative">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#F5F5F7]">Threshold</h3>
                        <Info className="w-3.5 h-3.5 text-[#71717A]" />
                      </div>
                      <p className="text-xs text-[#71717A]">Any transaction requires the confirmation of:</p>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowThresholdDropdown(!showThresholdDropdown)}
                            className="bg-[#0A0A0B] border border-[#8B8FE8] rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-[#F5F5F7] cursor-pointer hover:bg-[#18181B] transition-colors min-w-[64px] justify-between"
                          >
                            <span>{threshold}</span>
                            {showThresholdDropdown ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#8B8FE8]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#8B8FE8]" />
                            )}
                          </button>

                          <AnimatePresence>
                            {showThresholdDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                className="absolute left-0 top-full mt-1.5 w-16 bg-[#141417] border border-[rgba(245,245,247,0.14)] rounded-xl shadow-2xl z-50 overflow-hidden"
                              >
                                {signers.map((_, i) => {
                                  const val = (i + 1).toString();
                                  const isSelected = threshold === val;
                                  return (
                                    <button
                                      key={val}
                                      onClick={() => {
                                        setThreshold(val);
                                        setShowThresholdDropdown(false);
                                      }}
                                      className={`w-full py-2 text-center text-xs font-bold transition-colors cursor-pointer ${
                                        isSelected
                                          ? "bg-[#8B8FE8]/25 text-[#8B8FE8] font-bold"
                                          : "text-[#F5F5F7] hover:bg-[#18181B]"
                                      }`}
                                    >
                                      {val}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <span className="text-xs text-[#F5F5F7] font-medium">
                          out of {signers.length} signer(s)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setCreateSafeStep(1)}
                        className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={() => setCreateSafeStep(3)}
                        className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.25)]"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW PAGE (Matching Screenshot 1) */}
                {createSafeStep === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#8B8FE8] text-[#0A0A0B] font-bold text-xs flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#F5F5F7]">Review</h2>
                        <p className="text-xs text-[#71717A]">
                          You&apos;re about to create a new Safe account and will have to confirm the transaction with your connected wallet.
                        </p>
                      </div>
                    </div>

                    {/* Review Specs Details Table */}
                    <div className="space-y-4 font-mono text-xs border-y border-[rgba(245,245,247,0.06)] py-6">
                      <div className="grid grid-cols-3 items-center">
                        <span className="text-[#71717A]">Network</span>
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-xs font-bold text-[#F5F5F7]">
                            {selectedNetworks[0]}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center">
                        <span className="text-[#71717A]">Name</span>
                        <span className="col-span-2 font-bold text-[#F5F5F7]">{createSafeName}</span>
                      </div>

                      <div className="grid grid-cols-3 items-start">
                        <span className="text-[#71717A] pt-1">Signers</span>
                        <div className="col-span-2 space-y-3">
                          {signers.map((s, idx) => (
                            <div key={s.id} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#8B8FE8] to-[#E84142] flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                                {idx + 1}
                              </div>
                              <div className="overflow-hidden">
                                <span className="font-bold text-[#F5F5F7] block">{s.name}</span>
                                <span className="text-[10px] text-[#71717A] flex items-center gap-1.5">
                                  <span>{s.address}</span>
                                  <Copy className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" onClick={() => toast.success("Address copied")} />
                                  <ExternalLink className="w-3 h-3 cursor-pointer hover:text-[#8B8FE8]" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center">
                        <span className="text-[#71717A]">Threshold</span>
                        <span className="col-span-2 font-bold text-[#F5F5F7]">{threshold} out of {signers.length} signers</span>
                      </div>
                    </div>

                    {/* Before We Continue Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#F5F5F7]">Before we continue...</h3>
                      <div className="space-y-2 text-xs text-[#71717A]">
                        <p className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#8B8FE8] stroke-[3]" />
                          <span>There will be a one-time activation fee</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#8B8FE8] stroke-[3]" />
                          <span>If you choose to pay later, the fee will be included with the first transaction you make.</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#8B8FE8] stroke-[3]" />
                          <span>Safe doesn&apos;t profit from the fees.</span>
                        </p>
                      </div>

                      {/* Payment Options (Radio Buttons) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div
                          onClick={() => setPaymentOption("now")}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            paymentOption === "now"
                              ? "bg-[#18181B] border-[#8B8FE8]"
                              : "bg-[#111113] border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentOption === "now" ? "border-[#8B8FE8] bg-[#8B8FE8]" : "border-[#71717A]"
                          }`}>
                            {paymentOption === "now" && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#F5F5F7]">Pay now</p>
                            <p className="text-[10px] text-[#71717A] font-mono">~ 0.00005 ETH</p>
                          </div>
                        </div>

                        <div
                          onClick={() => setPaymentOption("later")}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            paymentOption === "later"
                              ? "bg-[#18181B] border-[#8B8FE8]"
                              : "bg-[#111113] border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentOption === "later" ? "border-[#8B8FE8] bg-[#8B8FE8]" : "border-[#71717A]"
                          }`}>
                            {paymentOption === "later" && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#F5F5F7]">Pay later</p>
                            <p className="text-[10px] text-[#71717A] font-mono">with the first transaction</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setCreateSafeStep(2)}
                        className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleDeployNewSafe}
                        className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.25)]"
                      >
                        Create account
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Preview & Info Panel */}
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-xl space-y-4">
                  <h3 className="text-xs font-bold text-[#F5F5F7] uppercase tracking-wider text-center font-mono">
                    Your Safe account preview
                  </h3>

                  <div className="space-y-3 pt-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A]">Wallet</span>
                      <span className="text-[#F5F5F7] font-semibold">{displayAddress}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[rgba(245,245,247,0.04)] pt-2">
                      <span className="text-[#71717A]">Name</span>
                      <span className="text-[#8B8FE8] font-bold">{createSafeName || "My Safe"}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[rgba(245,245,247,0.04)] pt-2">
                      <span className="text-[#71717A]">Network(s)</span>
                      <span className="text-[#F5F5F7]">{selectedNetworks[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111113]/60 border border-[rgba(245,245,247,0.06)] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#8B8FE8] font-semibold">
                    <span>Safe account creation</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[10px] text-[#71717A] leading-relaxed">
                    Flat hierarchy & managing signers settings configured.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CREATE WORKSPACE WIZARD (Steps 1 to 4) */}
        {workspaceStep !== null && (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F7]">
                Create new workspace
              </h1>
              <span className="text-xs font-mono text-[#8B8FE8] px-3 py-1 rounded-full bg-[#8B8FE8]/15 border border-[#8B8FE8]/30 font-bold">
                Step {workspaceStep} of 4
              </span>
            </div>

            <div className="p-8 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] shadow-2xl space-y-8 max-w-3xl mx-auto">
              
              {/* STEP 1: WORKSPACE IDENTITY */}
              {workspaceStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#F5F5F7]">Workspace Details</h2>
                    <p className="text-xs text-[#71717A] leading-relaxed font-sans">
                      Workspaces let your organization manage team members, address books, and multiple accounts in one place.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[#71717A] uppercase tracking-wider block">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Corporate Treasury Workspace"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.12)] focus:border-[#8B8FE8] rounded-2xl px-4 py-3 text-xs text-[#F5F5F7] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[rgba(245,245,247,0.06)]">
                    <button
                      onClick={() => setWorkspaceStep(null)}
                      className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        if (!workspaceName.trim()) {
                          toast.error("Please enter a workspace name");
                          return;
                        }
                        setWorkspaceStep(2);
                      }}
                      className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.25)] flex items-center gap-2"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: LINK ACCOUNTS */}
              {workspaceStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#F5F5F7]">Link Accounts</h2>
                    <p className="text-xs text-[#71717A] leading-relaxed font-sans">
                      Select which accounts belong to this workspace. You can also add more accounts later.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {safes.length > 0 ? (
                      safes.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            if (selectedSafeIds.includes(s.id)) {
                              setSelectedSafeIds(selectedSafeIds.filter((id) => id !== s.id));
                            } else {
                              setSelectedSafeIds([...selectedSafeIds, s.id]);
                            }
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedSafeIds.includes(s.id)
                              ? "bg-[#8B8FE8]/15 border-[#8B8FE8]"
                              : "bg-[#18181B]/80 border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-[#8B8FE8]" />
                            <div>
                              <h4 className="text-xs font-bold text-[#F5F5F7]">{s.name}</h4>
                              <p className="text-[10px] text-[#71717A] font-mono">{s.address}</p>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedSafeIds.includes(s.id) ? "bg-[#8B8FE8] border-[#8B8FE8] text-[#0A0A0B]" : "border-[rgba(245,245,247,0.2)]"
                          }`}>
                            {selectedSafeIds.includes(s.id) && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#18181B]/50 border border-dashed border-[rgba(245,245,247,0.08)] text-center text-xs text-[#71717A]">
                        No accounts created yet. You can add accounts after creating your workspace.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[rgba(245,245,247,0.06)]">
                    <button
                      onClick={() => setWorkspaceStep(1)}
                      className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={() => setWorkspaceStep(3)}
                      className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.25)] flex items-center gap-2"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: INVITE TEAM MEMBERS */}
              {workspaceStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#F5F5F7]">Invite Team Members</h2>
                    <p className="text-xs text-[#71717A] leading-relaxed font-sans">
                      Add email addresses or Ethereum addresses to invite collaborators.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {teamInvites.map((invite, idx) => (
                      <div key={invite.id} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Email or 0x address"
                          value={invite.identifier}
                          onChange={(e) => {
                            const updated = [...teamInvites];
                            updated[idx].identifier = e.target.value;
                            setTeamInvites(updated);
                          }}
                          className="flex-1 bg-[#0A0A0B] border border-[rgba(245,245,247,0.12)] focus:border-[#8B8FE8] rounded-2xl px-4 py-3 text-xs text-[#F5F5F7] focus:outline-none font-mono"
                        />

                        <select
                          value={invite.role}
                          onChange={(e) => {
                            const updated = [...teamInvites];
                            updated[idx].role = e.target.value as any;
                            setTeamInvites(updated);
                          }}
                          className="bg-[#0A0A0B] border border-[rgba(245,245,247,0.12)] rounded-2xl px-4 py-3 text-xs text-[#F5F5F7] focus:outline-none font-mono"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                          <option value="Signer">Signer</option>
                        </select>
                      </div>
                    ))}

                    <button
                      onClick={() => setTeamInvites([...teamInvites, { id: Date.now().toString(), identifier: "", role: "Member" }])}
                      className="text-xs font-semibold text-[#8B8FE8] hover:underline flex items-center gap-1.5 pt-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add another invite</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[rgba(245,245,247,0.06)]">
                    <button
                      onClick={() => setWorkspaceStep(2)}
                      className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={() => setWorkspaceStep(4)}
                      className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.25)] flex items-center gap-2"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & CREATE WORKSPACE */}
              {workspaceStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#F5F5F7]">Review Workspace</h2>
                    <p className="text-xs text-[#71717A] leading-relaxed font-sans">
                      Verify your workspace details before deploying.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-[rgba(245,245,247,0.08)] space-y-4 font-mono text-xs">
                    <div className="flex justify-between py-2 border-b border-[rgba(245,245,247,0.04)]">
                      <span className="text-[#71717A]">Workspace Name</span>
                      <span className="text-[#F5F5F7] font-bold">{workspaceName}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-[rgba(245,245,247,0.04)]">
                      <span className="text-[#71717A]">Linked Accounts</span>
                      <span className="text-[#8B8FE8] font-bold">{selectedSafeIds.length} Selected</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#71717A]">Team Invites</span>
                      <span className="text-[#F5F5F7] font-bold">{teamInvites.filter(t => t.identifier).length} Members</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[rgba(245,245,247,0.06)]">
                    <button
                      onClick={() => setWorkspaceStep(3)}
                      className="px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={() => {
                        const newWs = {
                          id: `ws-${Date.now()}`,
                          name: workspaceName,
                          accountsCount: selectedSafeIds.length,
                          membersCount: teamInvites.length,
                          avatarLetter: workspaceName.charAt(0).toUpperCase(),
                        };
                        setUserWorkspaces([...userWorkspaces, newWs]);
                        setWorkspaceStep(null);
                        toast.success(`Workspace "${workspaceName}" created successfully!`);
                        router.push("/workspace");
                      }}
                      className="px-6 py-3 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(139,143,232,0.3)]"
                    >
                      Create workspace
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: WORKSPACES DIRECTORY (When workspaceStep is null) */}
        {activeTab === "workspaces" && workspaceStep === null && createSafeStep === null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center space-y-8"
          >
            <div className="w-full flex items-center justify-between pb-6 border-b border-[rgba(245,245,247,0.08)]">
              <button
                onClick={() => setWorkspaceStep(1)}
                className="px-6 py-2.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs flex items-center gap-2 shadow-[0_4px_20px_rgba(139,143,232,0.25)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create workspace</span>
              </button>

              <div className="w-9 h-9 rounded-full bg-[#111113] border border-[rgba(245,245,247,0.12)] flex items-center justify-center text-[#71717A] hover:text-[#F5F5F7] cursor-pointer">
                <User className="w-4 h-4" />
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => router.push("/workspace")}
                  className="p-6 rounded-3xl bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 transition-all cursor-pointer group flex flex-col justify-between h-44 shadow-xl relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8] font-bold text-lg">
                      {ws.avatarLetter}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`Workspace options for ${ws.name}`);
                      }}
                      className="p-1.5 text-[#71717A] hover:text-[#F5F5F7] rounded-lg hover:bg-[#18181B] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                      {ws.name}
                    </h3>
                    <p className="text-xs text-[#71717A] font-mono mt-1">
                      {ws.accountsCount} Accounts · {ws.membersCount} Member
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </main>

      {/* POST-CREATION SUCCESS MODAL (Matching Screenshot 2) */}
      <AnimatePresence>
        {showSuccessModal && newlyCreatedSafe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111113] border border-[rgba(245,245,247,0.12)] rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              {/* Big Checkmark Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[#8B8FE8]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-bold text-[#F5F5F7]">Your account is almost set!</h2>
                <p className="text-xs text-[#71717A] leading-relaxed mt-2 font-sans">
                  Activate the account to unlock all features of your smart wallet. Use your address to receive funds on Ethereum.
                </p>
              </div>

              {/* Safe Account Details Box (Screenshot 2) */}
              <div className="w-full p-4 rounded-2xl bg-[#0A0A0B] border border-[rgba(245,245,247,0.08)] flex flex-col items-start text-left space-y-2">
                <div className="w-5 h-5 rounded-full bg-[#8B8FE8]/20 border border-[#8B8FE8]/40 flex items-center justify-center text-[10px] font-bold text-[#8B8FE8]">
                  Ξ
                </div>
                <h3 className="text-sm font-bold text-[#F5F5F7]">{newlyCreatedSafe.name}</h3>
                <p className="text-xs font-mono text-[#71717A] flex items-center gap-1.5 w-full justify-between">
                  <span className="truncate">{newlyCreatedSafe.address}</span>
                  <Copy className="w-3.5 h-3.5 cursor-pointer hover:text-[#8B8FE8] shrink-0" onClick={() => toast.success("Address copied")} />
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/dashboard");
                }}
                className="w-full py-3.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.3)] transition-all cursor-pointer"
              >
                Let&apos;s go
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE SAFE ACCOUNTS MODAL */}
      <AnimatePresence>
        {showManageSafesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111113] border border-[rgba(245,245,247,0.12)] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,245,247,0.06)]">
                <h3 className="text-base font-bold text-[#F5F5F7]">Manage Safe accounts</h3>
                <button
                  onClick={() => setShowManageSafesModal(false)}
                  className="p-1 text-[#71717A] hover:text-[#F5F5F7]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowManageSafesModal(false);
                    setShowImportModal(true);
                  }}
                  className="w-full p-4 rounded-2xl bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/40 flex items-center justify-between transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <Plus className="w-4 h-4 text-[#8B8FE8]" />
                    <div>
                      <p className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                        Add Safe accounts to this workspace
                      </p>
                      <p className="text-[10px] text-[#71717A] font-mono mt-0.5">
                        Add your owned and trusted Safes to this workspace
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717A]" />
                </button>

                <button
                  onClick={() => {
                    setShowManageSafesModal(false);
                    router.push("/dashboard/treasury");
                  }}
                  className="w-full p-4 rounded-2xl bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/40 flex items-center justify-between transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <Search className="w-4 h-4 text-[#8B8FE8]" />
                    <div>
                      <p className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                        See all Safe accounts
                      </p>
                      <p className="text-[10px] text-[#71717A] font-mono mt-0.5">
                        Your trusted and owned Safes
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717A]" />
                </button>

                <button
                  onClick={() => {
                    setShowManageSafesModal(false);
                    setCreateSafeStep(1);
                  }}
                  className="w-full p-4 rounded-2xl bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/40 flex items-center justify-between transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <Plus className="w-4 h-4 text-[#8B8FE8]" />
                    <div>
                      <p className="text-xs font-bold text-[#F5F5F7] group-hover:text-[#8B8FE8] transition-colors">
                        Create new Safe
                      </p>
                      <p className="text-[10px] text-[#71717A] font-mono mt-0.5">
                        Create a new Safe account
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#71717A]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111113] border border-[rgba(245,245,247,0.12)] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(245,245,247,0.06)]">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#8B8FE8]" />
                  <h3 className="text-base font-semibold text-[#F5F5F7]">Import Safe Data</h3>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-1 text-[#71717A] hover:text-[#F5F5F7]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 border-2 border-dashed border-[rgba(245,245,247,0.12)] rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-[#8B8FE8]/50 transition-colors">
                <Upload className="w-6 h-6 text-[#71717A]" />
                <p className="text-xs font-mono text-[#F5F5F7]">Drop Safe JSON file here or click to browse</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#71717A] hover:text-[#F5F5F7]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#71717A]">Loading...</div>}>
      <AccountsPageContent />
    </Suspense>
  );
}
