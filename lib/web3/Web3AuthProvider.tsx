"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Web3AuthProvider as Web3AuthModalProvider, type Web3AuthContextConfig } from "@web3auth/modal/react";
import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import { UserRole } from '@/types';
import { useSessionStore } from '@/lib/stores/sessionStore';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

// Validate clientId is provided
if (!clientId || clientId === "your_client_id_here") {
  const errorMessage =
    "❌ Web3Auth Client ID is missing or invalid!\n" +
    "📝 Please follow these steps:\n" +
    "1. Go to https://dashboard.web3auth.io/\n" +
    "2. Sign up or login\n" +
    "3. Create a new project\n" +
    "4. Copy your Client ID\n" +
    "5. Add it to .env.local as NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_actual_client_id";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  }
};

interface Web3AuthContextType {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within Web3AuthProvider');
  }
  return context;
};

export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { role, setRole } = useSessionStore();

  return (
    <Web3AuthModalProvider config={web3AuthContextConfig}>
      <Web3AuthContext.Provider
        value={{
          selectedRole: role,
          setSelectedRole: setRole,
        }}
      >
        {children}
      </Web3AuthContext.Provider>
    </Web3AuthModalProvider>
  );
};
