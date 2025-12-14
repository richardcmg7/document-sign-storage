import React, { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers'; // Import ethers for type checking

export default function DocumentHistory() {
  const { getDocumentCount, getDocumentHashByIndex, getDocumentInfo } = useContract();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        setError(''); // Clear previous errors

        const countBigInt = await getDocumentCount();
        const count = Number(countBigInt); // Convert BigInt to Number for iteration
        console.log('Fetched document count:', count);

        const docs = [];
        for (let i = 0; i < count; i++) {
          const hash = await getDocumentHashByIndex(i);
          console.log(`Fetched hash for index ${i}:`, hash);

          // Only fetch info if hash is valid (not 0x00...00)
          if (hash && hash !== ethers.ZeroHash) {
            const info = await getDocumentInfo(hash);
            console.log('Fetched info for hash:', hash, 'Info:', info);

            // Ensure info has expected properties/indices
            // Ethers.js typically returns struct fields as both array-like and named properties
            if (info && info.signer && info.timestamp && info.signature) {
              docs.push({
                hash: hash,
                signer: info.signer,
                timestamp: info.timestamp,
                signature: info.signature,
                // Also keep the raw info if needed for debugging or display
                rawInfo: info 
              });
            } else {
              console.warn('Incomplete info received for hash:', hash, info);
            }
          } else {
            console.warn(`Invalid hash received for index ${i}:`, hash);
          }
        }
        setDocuments(docs);
      } catch (err: any) {
        setError('Error loading history: ' + (err?.message || err.toString()));
        console.error('Error al cargar historial:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Yet</h3>
        <p className="text-gray-600">Start by uploading and signing your first document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">#{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Document Hash</p>
                    <p className="text-sm font-mono text-gray-900 font-medium">
                      {doc.hash.slice(0, 10)}...{doc.hash.slice(-8)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(doc.hash);
                    alert('Hash copied!');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy hash"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                {/* Signer */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Signer
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-mono text-gray-900 truncate">
                      {doc.signer.slice(0, 10)}...{doc.signer.slice(-6)}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(doc.signer);
                        alert('Address copied!');
                      }}
                      className="text-blue-600 hover:text-blue-700"
                      title="Copy address"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Timestamp
                  </p>
                  <p className="text-xs text-gray-900">
                    {new Date(Number(doc.timestamp)).toLocaleString()}
                  </p>
                </div>

                {/* Signature */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Signature
                  </p>
                  <p className="text-xs font-mono text-gray-900 truncate">
                    {doc.signature?.slice(0, 20)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
