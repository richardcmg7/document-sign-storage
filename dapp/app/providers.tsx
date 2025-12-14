'use client';
import { MetaMaskProvider } from '../contexts/MetaMaskContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MetaMaskProvider>
      {children}
    </MetaMaskProvider>
  );
}
