"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/wallet-provider";
import { Wallet, Mail, History, X, ChevronRight, ShieldCheck, Check } from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { ThirdwebConnectModal } from "@/components/thirdweb-connect-modal";

export default function OnboardingPage() {
  const router = useRouter();
  const { address, isConnected, isConnecting, connectWallet } = useWallet();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleWalletSelect = async (walletType: string) => {
    setIsLoading(true);
    setSelectedMethod("wallet");
    setShowWalletModal(false);
    try {
      await connectWallet(walletType);
      router.push("/accounts");
    } catch (err) {
      console.error("Wallet onboarding connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenericLogin = (method: string) => {
    setSelectedMethod(method);
    setIsLoading(true);
    setTimeout(() => {
      router.push("/accounts");
    }, 800);
  };

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
      <div className="relative z-10 flex flex-col items-center max-w-md w-full mx-auto space-y-6">

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full bg-[#111113]/85 backdrop-blur-2xl border border-[rgba(245,245,247,0.08)] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Subtle Ambient Top Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#8B8FE8]/15 blur-3xl pointer-events-none rounded-full" />

          {/* Logo */}
          <div className="flex items-center justify-center mb-1">
            <img
              src="/logo/logo - horizontal.png"
              alt="Sentinel Logo"
              className="h-28 w-auto object-contain"
            />
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F7] mt-5">
            Sign in to your workspace
          </h1>
          <p className="text-xs text-[#71717A] font-mono mt-1.5 max-w-xs">
            Encrypted treasury management & zero-knowledge policy check
          </p>

          {/* Auth Options Form */}
          <div className="w-full space-y-3 mt-7">
            
            {/* Wallet Button */}
            <button
              onClick={() => setShowWalletModal(true)}
              disabled={isLoading || isConnecting}
              className="w-full bg-[#F5F5F7] hover:bg-[#F5F5F7]/90 text-[#0A0A0B] font-semibold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(245,245,247,0.15)] transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-70"
            >
              {isConnecting || (isLoading && selectedMethod === "wallet") ? (
                <div className="w-5 h-5 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
              ) : isConnected ? (
                <>
                  <Check className="w-4 h-4 text-[#0A0A0B]" />
                  <span className="text-sm font-bold">Connected ({address?.slice(0, 6)}...)</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 text-[#0A0A0B]" />
                  <span className="text-sm">Continue with wallet</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-[rgba(245,245,247,0.08)]" />
              <span className="absolute bg-[#111113] px-3 text-[10px] uppercase font-mono tracking-widest text-[#71717A]">
                OR
              </span>
            </div>

            {/* Google Social Login */}
            <button
              onClick={() => handleGenericLogin("google")}
              disabled={isLoading}
              className="w-full bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 text-[#F5F5F7] py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading && selectedMethod === "google" ? (
                <div className="w-4 h-4 border-2 border-[#8B8FE8] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Email OTP Login */}
            <button
              onClick={() => handleGenericLogin("email")}
              disabled={isLoading}
              className="w-full bg-[#18181B]/80 hover:bg-[#202024] border border-[rgba(245,245,247,0.08)] hover:border-[#8B8FE8]/40 text-[#F5F5F7] py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading && selectedMethod === "email" ? (
                <div className="w-4 h-4 border-2 border-[#8B8FE8] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Mail className="w-4 h-4 text-[#71717A]" />
                  <span>Continue with email</span>
                </>
              )}
            </button>

            {/* Demo / Old UI Option */}
            <button
              onClick={() => handleGenericLogin("demo")}
              disabled={isLoading}
              className="w-full bg-transparent hover:bg-white/[0.03] border border-[rgba(245,245,247,0.12)] hover:border-[#8B8FE8]/50 text-[#F5F5F7] py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-70 mt-1"
            >
              {isLoading && selectedMethod === "demo" ? (
                <div className="w-4 h-4 border-2 border-[#8B8FE8] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <History className="w-4 h-4 text-[#71717A]" />
                  <span>Use demo workspace</span>
                </>
              )}
            </button>

          </div>
        </motion.div>

        {/* Footer Policy Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-[11px] text-[#71717A] text-center font-mono"
        >
          By continuing, you agree to the{" "}
          <a href="/docs" className="text-[#8B8FE8] hover:underline underline-offset-2">
            Terms
          </a>{" "}
          and{" "}
          <a href="/docs" className="text-[#8B8FE8] hover:underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </motion.p>

      </div>

      {/* Thirdweb Connect Wallet Modal */}
      <ThirdwebConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </div>
  );
}
