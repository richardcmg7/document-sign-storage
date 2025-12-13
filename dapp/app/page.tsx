
'use client';
import { MetaMaskProvider } from '../contexts/MetaMaskContext';
import FileUploader from '../components/FileUploader';
import DocumentSigner from '../components/DocumentSigner';
import DocumentVerifier from '../components/DocumentVerifier';
import DocumentHistory from '../components/DocumentHistory';
import React, { useState } from 'react';

export default function HomePage() {
  const [tab, setTab] = useState<'upload' | 'verify' | 'history'>('upload');
  const [hash, setHash] = useState<string>('');

  return (
    <MetaMaskProvider>
      <main className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Document Sign & Storage dApp</h1>
        <div className="flex gap-2 mb-6">
          <button className={tab === 'upload' ? 'font-bold' : ''} onClick={() => setTab('upload')}>Upload & Sign</button>
          <button className={tab === 'verify' ? 'font-bold' : ''} onClick={() => setTab('verify')}>Verify</button>
          <button className={tab === 'history' ? 'font-bold' : ''} onClick={() => setTab('history')}>History</button>
        </div>
        {tab === 'upload' && (
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <FileUploader onHash={setHash} />
            {hash && <DocumentSigner hash={hash} />}
          </div>
        )}
        {tab === 'verify' && <DocumentVerifier />}
        {tab === 'history' && <DocumentHistory />}
      </main>
    </MetaMaskProvider>
  );
}
