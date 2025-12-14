'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';

// Extend window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface MetaMaskContextProps {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  getSigner: () => Promise<ethers.JsonRpcSigner | null>;
  provider: ethers.BrowserProvider | null;
}

const MetaMaskContext = createContext<MetaMaskContextProps | undefined>(undefined);

export function MetaMaskProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Initialize provider and check connection on mount
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Check if already connected
      browserProvider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
          setIsConnected(true);
        }
      });

      // Get chain ID
      window.ethereum.request({ method: 'eth_chainId' }).then((id: string) => {
        setChainId(id);
      });

      // Event Listeners
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      };

      const handleChainChanged = (newChainId: string) => {
        setChainId(newChainId);
        window.location.reload(); // Recommended by MetaMask
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const connect = useCallback(async () => {
    if (!provider) return;
    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }, [provider]);

  const disconnect = useCallback(() => {
    // MetaMask doesn't strictly support "disconnect" from DApp side, 
    // but we can clear local state
    setAddress(null);
    setIsConnected(false);
  }, []);

  const getSigner = useCallback(async () => {
    if (!provider) return null;
    return await provider.getSigner();
  }, [provider]);

  return (
    <MetaMaskContext.Provider value={{ 
      address, 
      isConnected, 
      chainId, 
      connect, 
      disconnect, 
      getSigner,
      provider 
    }}>
      {children}
    </MetaMaskContext.Provider>
  );
}

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (!context) throw new Error('useMetaMask must be used within a MetaMaskProvider');
  return context;
}
