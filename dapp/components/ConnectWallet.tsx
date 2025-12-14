'use client';
import { useMetaMask } from '../contexts/MetaMaskContext';

export default function ConnectWallet() {
  const { address, isConnected, connect, disconnect } = useMetaMask();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-sm font-mono text-gray-700">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={disconnect}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
        alt="MetaMask" 
        className="w-5 h-5"
      />
      Connect Wallet
    </button>
  );
}
