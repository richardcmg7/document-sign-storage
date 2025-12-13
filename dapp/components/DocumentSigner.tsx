import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { useContract } from '../hooks/useContract';

export default function DocumentSigner({ hash }: { hash: string }) {
  const { signMessage, address } = useMetaMask();
  const { storeDocumentHash } = useContract();
  const [signature, setSignature] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleSign = async () => {
    if (!hash) return;
    if (!address) return;
    if (!window.confirm(`¿Firmarás el hash?\n${hash}`)) return;
    setStatus('Firmando...');
    const sig = await signMessage(hash);
    setSignature(sig);
    setStatus('Firma generada.');
  };

  const handleStore = async () => {
    if (!signature) return;
    if (!window.confirm('¿Confirmas almacenar en blockchain?')) return;
    setStatus('Enviando transacción...');
    try {
      const timestamp = BigInt(Date.now());
      console.log('storeDocumentHash params:', { hash, timestamp: timestamp.toString(), signature, address });
      await storeDocumentHash(hash, timestamp, signature, address);
      setStatus('Documento almacenado en blockchain.');
    } catch (err: any) {
      if (
        (err?.reason && err.reason.includes('Document already exists')) ||
        (err?.message && err.message.includes('Document already exists'))
      ) {
        setStatus('❌ El documento ya fue almacenado previamente.');
      } else {
        setStatus('Error al almacenar: ' + (err?.message || err));
      }
      console.error('Error al almacenar documento:', err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button className="btn" onClick={handleSign} disabled={!hash}>Sign Document</button>
      {/* Mostrar dirección del firmante con botón copiar */}
      {address && (
        <div className="flex items-center gap-2 text-xs">
          <span>Dirección firmante: {address}</span>
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => navigator.clipboard.writeText(address)}
            title="Copiar dirección"
          >
            Copiar
          </button>
        </div>
      )}
      {signature && (
        <>
          <div className="break-all text-xs">Firma: {signature}</div>
          <button className="btn" onClick={handleStore}>Store on Blockchain</button>
        </>
      )}
      {status && <div className="text-sm text-blue-600">{status}</div>}
    </div>
  );
}
