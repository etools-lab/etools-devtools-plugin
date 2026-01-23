import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
  error: Error | null;
}

export function useClipboard(): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (err) {
      setCopied(false);
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      return false;
    }
  }, []);

  return {
    copied,
    copyToClipboard,
    error,
  };
}
