"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <DashboardContext.Provider value={{ isLocked, setIsLocked }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
