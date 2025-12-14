'use client';
import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import abi from '../abi/DocumentRegistry.json';
import { useMemo } from 'react';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const fallbackProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

// DEBUG LOGS
console.log('--- useContract Config ---');
console.log('Contract Address:', contractAddress);
console.log('RPC URL:', process.env.NEXT_PUBLIC_RPC_URL);
console.log('--------------------------');

export function useContract() {
  const { provider: walletProvider, getSigner } = useMetaMask();

  const contract = useMemo(() => {
    // Priority to wallet provider (MetaMask) if available to ensure we are on the same network
    const p = walletProvider || fallbackProvider;
    console.log('Using provider:', walletProvider ? 'MetaMask (Wallet)' : 'Fallback (RPC)');
    return new ethers.Contract(contractAddress, abi.abi, p);
  }, [walletProvider]);

  const storeDocumentHash = async (hash: string, timestamp: number, signature: string, signerAddress: string) => {
    const signer = await getSigner();
    if (!signer) throw new Error("Wallet not connected");
    
    // Connect the signer to the contract to enable write operations
    const contractWithSigner = contract.connect(signer) as ethers.Contract;
    
    // Add manual gas limit to avoid estimation errors on local networks
    const tx = await contractWithSigner.storeDocumentHash(
      hash, 
      timestamp, 
      signature, 
      signerAddress,
      { gasLimit: 500000 }
    );
    await tx.wait();
    return tx;
  };

  const getDocumentInfo = async (hash: string) => {
    return await contract.getDocumentInfo(hash);
  };

  const isDocumentStored = async (hash: string) => {
    return await contract.isDocumentStored(hash);
  };

  const getDocumentCount = async () => {
    return await contract.getDocumentCount();
  };

  const getDocumentHashByIndex = async (index: number) => {
    return await contract.getDocumentHashByIndex(index);
  };

  const verifyDocument = async (hash: string, signer: string, signature: string) => {
    return await contract.verifyDocument(hash, signer, signature);
  };

  return {
    storeDocumentHash,
    getDocumentInfo,
    isDocumentStored,
    getDocumentCount,
    getDocumentHashByIndex,
    verifyDocument,
  };
}
