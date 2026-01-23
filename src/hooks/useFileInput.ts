import { useState, useRef, useCallback } from 'react';

interface UseFileInputOptions {
  onFileRead: (content: string, fileName: string) => void;
  onError?: (error: Error) => void;
  encoding?: string;
}

interface UseFileInputReturn {
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  reset: () => void;
}

export function useFileInput({
  onFileRead,
  onError,
  encoding = 'UTF-8',
}: UseFileInputOptions): UseFileInputReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);

      try {
        const content = await readFileContent(file, encoding);
        onFileRead(content, file.name);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to read file');
        onError?.(error);
      } finally {
        setIsLoading(false);
        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onFileRead, onError, encoding]
  );

  const reset = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    fileInputRef,
    isLoading,
    handleFileSelect,
    reset,
  };
}

async function readFileContent(file: File, encoding: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file, encoding);
  });
}
