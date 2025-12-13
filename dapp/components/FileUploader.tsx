import React, { useRef, useState } from 'react';
import { ethers } from 'ethers';

type Props = {
  onHash: (hash: string) => void;
};

export default function FileUploader({ onHash }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(2) + ' KB');
    
    const arrayBuffer = await file.arrayBuffer();
    const calculatedHash = ethers.keccak256(new Uint8Array(arrayBuffer));
    setHash(calculatedHash);
    onHash(calculatedHash);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && fileInput.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.current.files = dataTransfer.files;
      
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(2) + ' KB');
      
      const arrayBuffer = await file.arrayBuffer();
      const calculatedHash = ethers.keccak256(new Uint8Array(arrayBuffer));
      setHash(calculatedHash);
      onHash(calculatedHash);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInput}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                Drop your file here or <span className="text-blue-600">browse</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOC, TXT, or any file type
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* File Info */}
      {fileName && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {fileSize}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ready
            </span>
          </div>
        </div>
      )}

      {/* Hash Display */}
      {hash && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Document Hash (Keccak256)
              </p>
              <p className="text-xs font-mono text-gray-700 break-all bg-white rounded px-2 py-1 border border-gray-200">
                {hash}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
