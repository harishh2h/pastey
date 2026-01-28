'use client';

import { useState } from 'react';

interface CopyButtonProps {
  content: string;
}

/**
 * CopyButton component for copying paste content to clipboard.
 * Displays feedback to user upon successful copy.
 */
export function CopyButton({ content }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setHasError(false);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
    }
  }

  function getButtonText(): string {
    if (hasError) {
      return 'Failed';
    }
    if (isCopied) {
      return 'Copied!';
    }
    return 'Copy';
  }

  function getButtonClass(): string {
    const baseClass = 'border-4 border-black rounded-xl px-6 py-3 font-bold transition-colors';
    if (hasError) {
      return `${baseClass} bg-red-100 text-black hover:bg-red-200`;
    }
    return `${baseClass} bg-[#00f59b] text-black hover:bg-black hover:text-white`;
  }

  return (
    <button onClick={handleCopy} className={getButtonClass()}>
      {getButtonText()}
    </button>
  );
}
