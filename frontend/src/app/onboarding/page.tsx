"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/wallet-provider";
import { 
  Wallet, 
  Mail, 
  History, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Check, 
  Building2, 
  Plus, 
  ArrowRight,
  Search,
  Copy,
  ExternalLink,
  Code,
  Sparkles,
  Send,
  TrendingUp,
  Repeat,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { ThirdwebConnectModal } from "@/components/thirdweb-connect-modal";
import { toast } from "sonner";
import { getStoredWorkspaces, saveStoredWorkspace, saveStoredSafe, StoredWorkspace, StoredSafeAccount, getStoredSafes } from "@/lib/safe-storage";

export default function OnboardingPage() {
  const router = useRouter();
  const { address, isConnected, isConnecting, connectWallet } = useWallet();

  const [step, setStep] = useState<"auth" | "ws-step-1" | "ws-step-2" | "ws-step-3" | "ws-step-4">("auth");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Form States
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [teamInvites, setTeamInvites] = useState<{ id: string; input: string; role: string }[]>([
    { id: "1", input: "", role: "Member" },
  ]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  const [storedAccountsList, setStoredAccountsList] = useState<StoredSafeAccount[]>([]);

  useEffect(() => {
    setStoredAccountsList(getStoredSafes());
  }, []);

  // Auth Handler
  const handleAuthenticated = () => {
    const existingWorkspaces = getStoredWorkspaces();
    if (existingWorkspaces.length > 0) {
      router.push("/workspace");
    } else {
      setStep("ws-step-1");
    }
  };

  const handleWalletSelect = async (walletType: string) => {
    setIsLoading(true);
    setSelectedMethod("wallet");
    setShowWalletModal(false);
    try {
      await connectWallet(walletType);
      handleAuthenticated();
    } catch (err) {
      console.error("Wallet connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenericLogin = (method: string) => {
    setSelectedMethod(method);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleAuthenticated();
    }, 600);
  };

  // Final Workspace Deployment
  const handleCreateWorkspaceSubmit = () => {
    const finalWsName = workspaceName.trim() || "Treasury Ops";

    const newWs: StoredWorkspace = {
      id: `ws-${Date.now()}`,
      name: finalWsName,
      accountsCount: 0,
      membersCount: teamInvites.filter(t => t.input).length + 1,
      avatarLetter: finalWsName.charAt(0).toUpperCase(),
    };
    saveStoredWorkspace(newWs);

    // Clear previous accounts so new workspace starts with 0 accounts (clean empty state)
    if (typeof window !== "undefined") {
      localStorage.removeItem("sentinel_safes");
    }

    toast.success(`Workspace "${finalWsName}" created successfully!`);
    router.push("/workspace");
  };

  const useCaseOptions = [
    { id: "protocol", title: "Operate a protocol", icon: Code },
    { id: "tokens", title: "Distribute tokens", icon: Sparkles },
    { id: "payments", title: "Run payments", icon: Send },
    { id: "yield", title: "Earn yield", icon: TrendingUp },
    { id: "liquidity", title: "Trade and provide liquidity", icon: Repeat },
    { id: "hold", title: "Hold assets", icon: Shield },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0A0A0B] flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#8B8FE8]/20 selection:text-[#8B8FE8]">
      {/* Background Effect */}
      <DottedGlowBackground
        gap={24}
        radius={1.5}
        color="rgba(245, 245, 247, 0.15)"
        glowColor="rgba(139, 143, 232, 0.6)"
        opacity={0.3}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full mx-auto space-y-6">

        {/* ========================================================================= */}
        {/* SCREEN 1: SIGN IN TO YOUR WORKSPACE (Screenshot 1) */}
        {/* ========================================================================= */}
        {step === "auth" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#8B8FE8]/15 blur-3xl pointer-events-none rounded-full" />

            {/* Logo */}
            <div className="flex items-center justify-center mb-2">
              <img
                src="/logo/logo - horizontal.png"
                alt="Sentinel Logo"
                className="h-28 w-auto object-contain"
              />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F7]">
              Sign in to your workspace
            </h1>

            {/* Auth Options */}
            <div className="w-full space-y-3.5 mt-7">
              
              {/* Primary Connected Wallet Chip / Disconnected Button */}
              {isConnected ? (
                <button
                  onClick={handleAuthenticated}
                  className="w-full bg-[#F5F5F7] hover:bg-[#F5F5F7]/90 text-[#0A0A0B] font-bold py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgba(245,245,247,0.15)] transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B8FE8] via-[#E84142] to-[#45D6A7] flex items-center justify-center text-[9px] font-bold text-white shadow-inner">
                      avax
                    </div>
                    <span className="font-mono text-xs text-[#0A0A0B] font-bold">
                      avax:{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x7e7d...bBEa"}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0A0A0B]" />
                </button>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  disabled={isLoading}
                  className="w-full bg-[#F5F5F7] hover:bg-[#F5F5F7]/90 text-[#0A0A0B] font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(245,245,247,0.15)] transition-all cursor-pointer text-xs"
                >
                  <Wallet className="w-4 h-4 text-[#0A0A0B]" />
                  <span>Continue with wallet</span>
                </button>
              )}

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-[rgba(245,245,247,0.08)]" />
                <span className="absolute bg-[#111113] px-3 text-[10px] uppercase font-mono tracking-widest text-[#71717A]">
                  OR
                </span>
              </div>

              {/* Google */}
              <button
                onClick={() => handleGenericLogin("google")}
                disabled={isLoading}
                className="w-full bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] text-[#F5F5F7] py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-semibold transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Email */}
              <button
                onClick={() => handleGenericLogin("email")}
                disabled={isLoading}
                className="w-full bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] text-[#F5F5F7] py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-semibold transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#71717A]" />
                <span>Continue with email</span>
              </button>

              {/* Demo / Old UI */}
              <button
                onClick={() => handleGenericLogin("demo")}
                disabled={isLoading}
                className="w-full bg-transparent hover:bg-white/[0.03] border border-[rgba(245,245,247,0.12)] text-[#F5F5F7] py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-semibold transition-all cursor-pointer mt-1"
              >
                <History className="w-4 h-4 text-[#71717A]" />
                <span>Use demo workspace</span>
              </button>

            </div>

            <p className="text-[10px] text-[#71717A] font-mono mt-8">
              By continuing, you agree to the <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1 / 4: CREATE A WORKSPACE (Screenshot 2) */}
        {/* ========================================================================= */}
        {step === "ws-step-1" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
          >
            <div className="space-y-6">
              {/* Sentinel Brand Mark */}
              <div className="flex items-center gap-2">
                <img src="/logo/logo - horizontal.png" alt="Sentinel Logo" className="h-20 md:h-24 w-auto object-contain -ml-2" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#71717A] tracking-widest uppercase block">
                  STEP 1 / 4
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
                  Create a Workspace
                </h1>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Your team&apos;s home for managing accounts, tracking activity, and collaborating.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-mono text-[#F5F5F7] font-semibold block">
                  Workspace name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Treasury Ops, DeFi Team"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.14)] focus:border-[#8B8FE8] rounded-2xl px-4 py-3.5 text-xs text-[#F5F5F7] focus:outline-none font-mono placeholder:text-[#71717A]/60"
                />
              </div>
            </div>

            {/* Bottom Nav Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-[rgba(245,245,247,0.06)]">
              <button
                onClick={() => setStep("auth")}
                className="flex-1 py-3.5 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => {
                  if (!workspaceName.trim()) {
                    toast.error("Please enter a workspace name");
                    return;
                  }
                  setStep("ws-step-2");
                }}
                className="flex-1 py-3.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 / 4: SELECT ACCOUNTS (Screenshot 3) */}
        {/* ========================================================================= */}
        {step === "ws-step-2" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img src="/logo/logo - horizontal.png" alt="Sentinel Logo" className="h-20 md:h-24 w-auto object-contain -ml-2" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#71717A] tracking-widest uppercase block">
                  STEP 2 / 4
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
                  Select Accounts
                </h1>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Choose which accounts to add to this Workspace. You can add more later.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search for accounts"
                  className="w-full bg-[#0A0A0B] border border-[rgba(245,245,247,0.12)] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#F5F5F7] placeholder:text-[#71717A]/60 focus:outline-none focus:border-[#8B8FE8] font-mono"
                />
              </div>

              {/* Accounts List Container */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span className="uppercase tracking-wider">OWNED ACCOUNTS</span>
                  <span>Select all ({selectedAccountIds.length}/{storedAccountsList.length || 1})</span>
                </div>

                {storedAccountsList.length > 0 ? (
                  storedAccountsList.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => {
                        if (selectedAccountIds.includes(acc.id)) {
                          setSelectedAccountIds(selectedAccountIds.filter(id => id !== acc.id));
                        } else {
                          setSelectedAccountIds([...selectedAccountIds, acc.id]);
                        }
                      }}
                      className="p-4 rounded-2xl bg-[#111113] border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedAccountIds.includes(acc.id) ? "bg-[#8B8FE8] border-[#8B8FE8]" : "border-[#71717A]"}`}>
                          {selectedAccountIds.includes(acc.id) && <Check className="w-3 h-3 text-[#0A0A0B] stroke-[3]" />}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B8FE8] via-[#E84142] to-[#45D6A7] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                          0x
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#F5F5F7]">{acc.name}</h4>
                          <p className="text-[10px] font-mono text-[#71717A]">{acc.address.slice(0, 6)}...{acc.address.slice(-4)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-1">
                          <div className="w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center text-[8px] font-bold text-white">Ξ</div>
                          <div className="w-5 h-5 rounded-full bg-[#E84142] flex items-center justify-center text-[8px] font-bold text-white">▲</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#18181B] border border-[rgba(245,245,247,0.08)] text-[10px] font-mono text-[#71717A]">
                          2/3
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-2xl bg-[#111113]/80 border border-dashed border-[rgba(245,245,247,0.08)] flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-xs font-semibold text-[#F5F5F7]">No accounts created yet</p>
                    <p className="text-[10px] text-[#71717A] font-mono">You can create your accounts after completing your workspace setup.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[rgba(245,245,247,0.06)]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep("ws-step-1")}
                  className="flex-1 py-3.5 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setStep("ws-step-3")}
                  className="flex-1 py-3.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setStep("ws-step-3")}
                className="w-full text-center text-xs font-mono text-[#71717A] hover:text-[#F5F5F7] underline cursor-pointer"
              >
                Skip, add accounts later
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 / 4: INVITE YOUR TEAM (Screenshot 4) */}
        {/* ========================================================================= */}
        {step === "ws-step-3" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img src="/logo/logo - horizontal.png" alt="Sentinel Logo" className="h-20 md:h-24 w-auto object-contain -ml-2" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#71717A] tracking-widest uppercase block">
                  STEP 3 / 4
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
                  Invite your team
                </h1>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Add people to collaborate on this Workspace.
                </p>
              </div>

              <div className="space-y-3">
                {teamInvites.map((inv, idx) => (
                  <div key={inv.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Email, wallet address or ENS name"
                      value={inv.input}
                      onChange={(e) => {
                        const updated = [...teamInvites];
                        updated[idx].input = e.target.value;
                        setTeamInvites(updated);
                      }}
                      className="flex-1 bg-[#0A0A0B] border border-[rgba(245,245,247,0.14)] focus:border-[#8B8FE8] rounded-2xl px-4 py-3.5 text-xs text-[#F5F5F7] focus:outline-none font-mono placeholder:text-[#71717A]/60"
                    />

                    <select
                      value={inv.role}
                      onChange={(e) => {
                        const updated = [...teamInvites];
                        updated[idx].role = e.target.value;
                        setTeamInvites(updated);
                      }}
                      className="bg-[#111113] border border-[rgba(245,245,247,0.14)] rounded-2xl px-4 py-3.5 text-xs font-semibold text-[#F5F5F7] focus:outline-none cursor-pointer"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                      <option value="Signer">Signer</option>
                    </select>
                  </div>
                ))}

                <button
                  onClick={() => setTeamInvites([...teamInvites, { id: Date.now().toString(), input: "", role: "Member" }])}
                  className="text-xs font-semibold text-[#F5F5F7] hover:text-[#8B8FE8] flex items-center gap-1.5 pt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add another</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[rgba(245,245,247,0.06)]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep("ws-step-2")}
                  className="flex-1 py-3.5 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setStep("ws-step-4")}
                  className="flex-1 py-3.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setStep("ws-step-4")}
                className="w-full text-center text-xs font-mono text-[#71717A] hover:text-[#F5F5F7] underline cursor-pointer"
              >
                Skip, invite later
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4 / 4: HOW WILL YOU USE SENTINEL? (Screenshot 5) */}
        {/* ========================================================================= */}
        {step === "ws-step-4" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-[#111113]/90 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img src="/logo/logo - horizontal.png" alt="Sentinel Logo" className="h-20 md:h-24 w-auto object-contain -ml-2" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#71717A] tracking-widest uppercase block">
                  STEP 4 / 4
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7]">
                  How will you use Sentinel?
                </h1>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Select all that apply. We&apos;ll tailor your setup.
                </p>
              </div>

              {/* 6 Selectable Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {useCaseOptions.map((uc) => {
                  const isSelected = selectedUseCases.includes(uc.title);
                  const Icon = uc.icon;

                  return (
                    <div
                      key={uc.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedUseCases(selectedUseCases.filter(t => t !== uc.title));
                        } else {
                          setSelectedUseCases([...selectedUseCases, uc.title]);
                        }
                      }}
                      className={`p-4 rounded-2xl border flex flex-col justify-between h-32 transition-all cursor-pointer relative group ${
                        isSelected
                          ? "bg-[#111113] border-[#8B8FE8] text-[#F5F5F7]"
                          : "bg-[#111113]/50 border-[rgba(245,245,247,0.06)] hover:border-[#8B8FE8]/40 text-[#71717A]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#8B8FE8]/20 text-[#8B8FE8]" : "bg-[#18181B] text-[#71717A]"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "bg-[#8B8FE8] border-[#8B8FE8] text-[#0A0A0B]" : "border-[#71717A]/40"}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <span className={`text-xs font-bold leading-tight ${isSelected ? "text-[#F5F5F7]" : "text-[#71717A]"}`}>
                        {uc.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-[rgba(245,245,247,0.06)]">
              <button
                onClick={() => setStep("ws-step-3")}
                className="flex-1 py-3.5 rounded-2xl bg-[#18181B] hover:bg-[#202024] text-[#F5F5F7] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleCreateWorkspaceSubmit}
                className="flex-1 py-3.5 rounded-2xl bg-[#8B8FE8] hover:bg-[#8B8FE8]/90 text-[#0A0A0B] font-bold text-xs shadow-[0_4px_20px_rgba(139,143,232,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Create Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* Thirdweb Modal */}
      <ThirdwebConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </div>
  );
}
