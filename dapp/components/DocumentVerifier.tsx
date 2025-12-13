
import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

export default function DocumentVerifier() {
  const { isDocumentStored, getDocumentInfo } = useContract();
  const [file, setFile] = useState<File | null>(null);
  const [signer, setSigner] = useState('');
  const [result, setResult] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const handleVerify = async () => {
    if (!file || !signer) return;
    const arrayBuffer = await file.arrayBuffer();
    const hash = ethers.keccak256(new Uint8Array(arrayBuffer));
    const exists = await isDocumentStored(hash);
    if (!exists) {
      setResult('❌ Document not found');
      return;
    }
    const info = await getDocumentInfo(hash);
    console.log('Comparando firmante:', { signerInput: signer, signerOnChain: info[2] });
    if (info[2]?.toLowerCase() === signer.toLowerCase()) {
      setResult('✅ Documento válido');
    } else {
      setResult(`❌ Firmante incorrecto\nInput: ${signer}\nOnChain: ${info[2]}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" onChange={handleFileChange} />
      <input type="text" placeholder="Dirección del firmante" value={signer} onChange={e => setSigner(e.target.value)} />
      <button className="btn" onClick={handleVerify} disabled={!file || !signer}>Verify Document</button>
      {result && <div className="text-sm mt-2">{result}</div>}
    </div>
  );
}
