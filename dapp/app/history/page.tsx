"use client";
import { MetaMaskProvider } from '../../contexts/MetaMaskContext';
import DocumentHistory from '../../components/DocumentHistory';

export default function HistoryPage() {
  return (
    <MetaMaskProvider>
      <main className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Document History</h1>
        <DocumentHistory />
      </main>
    </MetaMaskProvider>
  );
}
