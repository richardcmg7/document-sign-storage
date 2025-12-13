import React, { useRef } from 'react';
import { ethers } from 'ethers';

type Props = {
  onHash: (hash: string) => void;
};

export default function FileUploader({ onHash }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const hash = ethers.keccak256(new Uint8Array(arrayBuffer));
    onHash(hash);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input type="file" ref={fileInput} onChange={handleFileChange} />
    </div>
  );
}
