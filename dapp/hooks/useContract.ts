import { useMetaMask } from '../contexts/MetaMaskContext';
import { ethers } from 'ethers';
import abi from '../abi/DocumentRegistry.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export function useContract() {
  const { getSigner } = useMetaMask();
  const contract = new ethers.Contract(contractAddress, abi.abi, provider);

  const storeDocumentHash = async (hash: string, timestamp: number, signature: string, signer: string) => {
    const walletSigner = getSigner();
    const tx = await contract.connect(walletSigner).storeDocumentHash(hash, timestamp, signature, signer);
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
