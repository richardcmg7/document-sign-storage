"use client";
import { MetaMaskProvider } from '../../contexts/MetaMaskContext';
import DocumentVerifier from '../../components/DocumentVerifier';

export default function VerifyPage() {
  return (
    <MetaMaskProvider>
      <main className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Verify Document</h1>
        <DocumentVerifier />
      </main>
    </MetaMaskProvider>
  );
}
