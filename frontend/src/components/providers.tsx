"use client";

import React from "react";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, avalancheFuji } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [mainnet, avalancheFuji],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [avalancheFuji.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
