
'use client';
import FileUploader from '../components/FileUploader';
import DocumentSigner from '../components/DocumentSigner';
import DocumentVerifier from '../components/DocumentVerifier';
import DocumentHistory from '../components/DocumentHistory';
import React, { useState } from 'react';

export default function HomePage() {
  const [tab, setTab] = useState<'upload' | 'verify' | 'history'>('upload');
  const [hash, setHash] = useState<string>('');

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Secure Document Verification
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Store, sign, and verify your documents on the Ethereum blockchain with cryptographic proof of authenticity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Immutable</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">100%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Secure</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">ECDSA</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Decentralized</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Web3</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6 inline-flex mx-auto">
        <button
          onClick={() => setTab('upload')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            tab === 'upload'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📤 Upload & Sign
        </button>
        <button
          onClick={() => setTab('verify')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            tab === 'verify'
              ? 'bg-green-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✓ Verify
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            tab === 'history'
              ? 'bg-purple-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 History
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl mx-auto">
        {tab === 'upload' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload & Sign Document</h2>
            <p className="text-gray-600 mb-6">Upload your document to generate a cryptographic hash and sign it with your wallet.</p>
            <div className="space-y-6">
              <FileUploader onHash={setHash} />
              {hash && (
                <div className="border-t border-gray-200 pt-6">
                  <DocumentSigner hash={hash} />
                </div>
              )}
            </div>
          </div>
        )}
        
        {tab === 'verify' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Document</h2>
            <p className="text-gray-600 mb-6">Verify the authenticity of a document by checking its hash and signature on the blockchain.</p>
            <DocumentVerifier />
          </div>
        )}
        
        {tab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Document History</h2>
            <p className="text-gray-600 mb-6">View all documents stored on the blockchain with their signatures and timestamps.</p>
            <DocumentHistory />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="font-semibold text-gray-900 mb-2">Cryptographic Security</h3>
          <p className="text-sm text-gray-600">Documents are hashed using Keccak256 and signed with ECDSA.</p>
        </div>
        <div>
          <div className="text-4xl mb-3">⛓️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Blockchain Storage</h3>
          <p className="text-sm text-gray-600">Immutable records stored on Ethereum blockchain forever.</p>
        </div>
        <div>
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold text-gray-900 mb-2">Easy Verification</h3>
          <p className="text-sm text-gray-600">Verify document authenticity in seconds with hash comparison.</p>
        </div>
      </div>
    </>
  );
}
