import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

const ANVIL_MNEMONIC = process.env.NEXT_PUBLIC_MNEMONIC || '';
const ANVIL_WALLETS = Array.from({ length: 10 }, (_, i) => {
  const path = `m/44'/60'/0'/0/${i}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(ANVIL_MNEMONIC, undefined, path);
  return { address: wallet.address, privateKey: wallet.privateKey };
});

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

interface MetaMaskContextProps {
  currentWallet: number;
  address: string;
  connect: (walletIndex: number) => void;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  getSigner: () => ethers.Wallet;
  switchWallet: (walletIndex: number) => void;
}

const MetaMaskContext = createContext<MetaMaskContextProps | undefined>(undefined);

export function MetaMaskProvider({ children }: { children: ReactNode }) {
  const [currentWallet, setCurrentWallet] = useState(0);
  const [address, setAddress] = useState(ANVIL_WALLETS[0].address);

  const connect = (walletIndex: number) => {
    setCurrentWallet(walletIndex);
    setAddress(ANVIL_WALLETS[walletIndex].address);
  };

  const disconnect = () => {
    setCurrentWallet(0);
    setAddress('');
  };

  const getSigner = () => {
    return new ethers.Wallet(ANVIL_WALLETS[currentWallet].privateKey, provider);
  };

  const signMessage = async (message: string) => {
    const signer = getSigner();
    return await signer.signMessage(message);
  };

  const switchWallet = (walletIndex: number) => {
    setCurrentWallet(walletIndex);
    setAddress(ANVIL_WALLETS[walletIndex].address);
  };

  return (
    <MetaMaskContext.Provider value={{ currentWallet, address, connect, disconnect, signMessage, getSigner, switchWallet }}>
      {children}
    </MetaMaskContext.Provider>
  );
}

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (!context) throw new Error('useMetaMask must be used within a MetaMaskProvider');
  return context;
}
