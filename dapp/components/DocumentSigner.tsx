import React, { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

export default function DocumentSigner({ hash }: { hash: string }) {
  const { getSigner, address } = useMetaMask();
  const { storeDocumentHash } = useContract();
  const [signature, setSignature] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!hash) return;
    if (!address) return;
    if (!window.confirm(`🔐 Sign this document hash?\n\n${hash}\n\nThis will create a cryptographic signature proving you verified this document.`)) return;
    
    setLoading(true);
    setStatus('Signing document...');
    try {
      const signer = await getSigner();
      if (!signer) throw new Error("Wallet not connected");

      // Sign the hash string (standard personal_sign)
      const sig = await signer.signMessage(hash);
      
      setSignature(sig);
      setStatus('✅ Signature generated successfully!');
    } catch (error: any) {
      console.error(error);
      setStatus('❌ Error signing: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStore = async () => {
    if (!signature) return;
    if (!window.confirm('📝 Store this document on the blockchain?\n\nThis action will:\n• Store the document hash permanently\n• Record your signature\n• Create an immutable timestamp\n\nProceed?')) return;
    
    setLoading(true);
    setStatus('Sending transaction to blockchain...');
    try {
      const timestamp = BigInt(Date.now());
      console.log('storeDocumentHash params:', { hash, timestamp: timestamp.toString(), signature, address });
      await storeDocumentHash(hash, timestamp, signature, address);
      setStatus('🎉 Document successfully stored on blockchain!');
    } catch (err: any) {
      if (
        (err?.reason && err.reason.includes('Document already exists')) ||
        (err?.message && err.message.includes('Document already exists'))
      ) {
        setStatus('This document has already been stored on the blockchain.');
      } else {
        setStatus('❌ Error storing document: ' + (err?.message || err));
      }
      console.error('Error al almacenar documento:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Signer Info */}
      {address && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Signer Address</p>
                <p className="text-sm font-mono text-gray-900">{address.slice(0, 10)}...{address.slice(-8)}</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(address);
                alert('Address copied to clipboard!');
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy address"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Sign Button */}
      {!signature && (
        <button
          onClick={handleSign}
          disabled={!hash || loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Sign Document</span>
            </>
          )}
        </button>
      )}

      {/* Signature Display */}
      {signature && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Digital Signature (ECDSA)
                </p>
                <p className="text-xs font-mono text-gray-700 break-all bg-white rounded px-2 py-1 border border-gray-200">
                  {signature}
                </p>
              </div>
            </div>
          </div>

          {/* Store Button */}
          <button
            onClick={handleStore}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Storing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <span>Store on Blockchain</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-lg border ${
          status.includes('❌') || status.includes('Error')
            ? 'bg-red-50 border-red-200 text-red-800'
            : status.includes('⚠️')
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : status.includes('🎉') || status.includes('✅')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <p className="text-sm font-medium">{status}</p>
        </div>
      )}
    </div>
  );
}
