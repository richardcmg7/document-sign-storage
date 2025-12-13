
import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

export default function DocumentVerifier() {
  const { isDocumentStored, getDocumentInfo } = useContract();
  const [file, setFile] = useState<File | null>(null);
  const [signer, setSigner] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [documentInfo, setDocumentInfo] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult('');
    setDocumentInfo(null);
  };

  const handleVerify = async () => {
    if (!file || !signer) return;
    setLoading(true);
    setResult('');
    setDocumentInfo(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hash = ethers.keccak256(new Uint8Array(arrayBuffer));
      console.log('Verificando hash:', hash);
      
      const exists = await isDocumentStored(hash);
      console.log('Documento existe?', exists);
      
      if (!exists) {
        setResult('❌ Document not found');
        setLoading(false);
        return;
      }
      
      const info = await getDocumentInfo(hash);
      console.log('Comparando firmante:', { signerInput: signer, signerOnChain: info[2] });
      
      setDocumentInfo({
        timestamp: new Date(Number(info[1])).toLocaleString(),
        signer: info[2],
        signature: info[3]
      });
      
      if (info[2]?.toLowerCase() === signer.toLowerCase()) {
        setResult('✅ Documento válido');
      } else {
        setResult(`❌ Firmante incorrecto\nInput: ${signer}\nOnChain: ${info[2]}`);
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Document to Verify
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
        />
      </div>

      {/* Signer Address Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Signer Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={signer}
          onChange={e => setSigner(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={!file || !signer || loading}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Verify Document</span>
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className={`p-6 rounded-lg border-2 ${
          result.includes('válido') || result.includes('✅')
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              result.includes('válido') || result.includes('✅')
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}>
              {result.includes('válido') || result.includes('✅') ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-lg font-bold ${
                result.includes('válido') || result.includes('✅')
                  ? 'text-green-900'
                  : 'text-red-900'
              }`}>
                {result.split('\n')[0]}
              </p>
              {result.split('\n').length > 1 && (
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                  {result.split('\n').slice(1).join('\n')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Info */}
      {documentInfo && (result.includes('válido') || result.includes('✅')) && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Document Details
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Timestamp</p>
              <p className="text-sm font-mono text-gray-900 bg-white rounded px-3 py-2 border border-gray-200">
                {documentInfo.timestamp}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Signer Address</p>
              <p className="text-sm font-mono text-gray-900 bg-white rounded px-3 py-2 border border-gray-200 break-all">
                {documentInfo.signer}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Signature</p>
              <p className="text-xs font-mono text-gray-900 bg-white rounded px-3 py-2 border border-gray-200 break-all">
                {documentInfo.signature}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
