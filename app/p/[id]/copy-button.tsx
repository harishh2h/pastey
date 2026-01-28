'use client';

import { useState } from 'react';

interface CopyButtonProps {
  content: string;
}

export function CopyButton({ content }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="border-4 border-black rounded-xl bg-[#00f59b] text-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-colors"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  );
}
