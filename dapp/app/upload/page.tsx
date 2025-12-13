"use client";
import { MetaMaskProvider } from '../../contexts/MetaMaskContext';
import FileUploader from '../../components/FileUploader';
import DocumentSigner from '../../components/DocumentSigner';
import React, { useState } from 'react';

export default function UploadPage() {
  const [hash, setHash] = useState<string>('');
  return (
    <MetaMaskProvider>
      <main className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Upload & Sign Document</h1>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <FileUploader onHash={setHash} />
          {hash && <DocumentSigner hash={hash} />}
        </div>
      </main>
    </MetaMaskProvider>
  );
}
