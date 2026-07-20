"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: (walletType?: string) => Promise<void>;
  disconnectWallet: () => void;
  requestWorkspaceSignature: (targetAddress?: string | null) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  requestWorkspaceSignature: async () => false,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet was manually connected in session (no persistent auto-connect without session flag)
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const sessionConnected = sessionStorage.getItem("sentinel_wallet_connected");
      if (sessionConnected === "true") {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              setAddress(accounts[0]);
            } else {
              sessionStorage.removeItem("sentinel_wallet_connected");
            }
          })
          .catch(() => {
            sessionStorage.removeItem("sentinel_wallet_connected");
          });
      }

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      if (window.ethereum.on) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, []);

  const connectWallet = async (walletType: string = "metamask") => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        // Fallback for hackathon demo if extension isn't present
        setAddress("0x7e7d01392B71a2B92BFEb40552b7194A2D29bBEa");
        sessionStorage.setItem("sentinel_wallet_connected", "true");
        setIsConnecting(false);
        return;
      }

      // Explicitly request permissions to FORCE MetaMask / Core Wallet to prompt user approval every time
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (permError) {
        console.warn("wallet_requestPermissions fallback to eth_requestAccounts", permError);
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        sessionStorage.setItem("sentinel_wallet_connected", "true");
      } else {
        throw new Error("No account authorized");
      }
    } catch (err: any) {
      console.error("Wallet Connection Error:", err);
      setError(err?.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const requestWorkspaceSignature = async (targetAddress?: string | null): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Fetch active address directly from window.ethereum to prevent address mismatch error in Core/MetaMask
        let signerAddress = address;
        try {
          const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
          if (accounts && accounts.length > 0) {
            signerAddress = accounts[0];
          }
        } catch (accErr) {
          console.warn("Error querying eth_accounts", accErr);
        }

        if (!signerAddress) {
          try {
            const reqAccounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
            if (reqAccounts && reqAccounts.length > 0) {
              signerAddress = reqAccounts[0];
            }
          } catch (reqErr) {
            console.warn("Error requesting eth_requestAccounts", reqErr);
          }
        }

        const activeAddr = signerAddress || targetAddress || "0x7e7d01392B71a2B92BFEb40552b7194A2D29bBEa";

        // Generate clean SIWE message
        const nonce = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        const timestamp = new Date().toISOString();
        const siweMessage = `app.sentinel.global wants you to sign in with your Ethereum account:\n${activeAddr}\n\nBy signing, you are agreeing to store this data in the Sentinel infrastructure. This does not initiate a transaction or cost any fees.\n\nURI: https://app.sentinel.global\nVersion: 1\nChain ID: 43113\nNonce:\n${nonce}\nIssued At: ${timestamp}`;

        // Convert UTF-8 string to 0x Hex format per EIP-1474 personal_sign specification
        const hexMessage = "0x" + Array.from(new TextEncoder().encode(siweMessage))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        try {
          // Standard EIP-1474 personal_sign params: [hexMessage, address]
          await window.ethereum.request({
            method: "personal_sign",
            params: [hexMessage, activeAddr],
          });
        } catch (hexErr: any) {
          if (hexErr?.code === 4001) throw hexErr; // User explicitly rejected signature
          // Fallback with plain string message for older provider extensions
          await window.ethereum.request({
            method: "personal_sign",
            params: [siweMessage, activeAddr],
          });
        }

        setAddress(activeAddr);
        sessionStorage.setItem("sentinel_wallet_connected", "true");
        return true;
      } else {
        // Web fallback without extension
        await new Promise((resolve) => setTimeout(resolve, 600));
        return true;
      }
    } catch (err: any) {
      console.error("Workspace Signature Authorization Rejected/Failed:", err);
      setError(err?.message || "Signature request rejected by wallet");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sentinel_wallet_connected");
      localStorage.removeItem("sentinel_wallet_connected");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: Boolean(address),
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        requestWorkspaceSignature,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
