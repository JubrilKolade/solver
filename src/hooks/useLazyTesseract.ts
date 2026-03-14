import { useEffect, useState, useCallback } from 'react';
import type { Worker as TesseractWorker } from 'tesseract.js';

/**
 * Hook for lazy loading Tesseract.js OCR
 * Only loads when explicitly needed to reduce bundle size
 */
export function useLazyTesseract() {
  const [worker, setWorker] = useState<TesseractWorker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initWorker = useCallback(async () => {
    if (worker) return worker;

    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import only when needed
      const { createWorker } = await import('tesseract.js');
      const newWorker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          console.log('Tesseract:', m.status, Math.round(m.progress * 100) + '%');
        },
      });

      setWorker(newWorker);
      setIsLoading(false);
      return newWorker;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load Tesseract';
      setError(errorMsg);
      setIsLoading(false);
      throw err;
    }
  }, [worker]);

  const recognize = useCallback(
    async (imagePath: string) => {
      try {
        const currentWorker = await initWorker();
        const result = await currentWorker.recognize(imagePath);
        return result.data.text;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'OCR failed';
        setError(errorMsg);
        throw err;
      }
    },
    [initWorker]
  );

  const terminate = useCallback(async () => {
    if (worker) {
      await worker.terminate();
      setWorker(null);
    }
  }, [worker]);

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (worker) {
        worker.terminate().catch(console.error);
      }
    };
  }, [worker]);

  return {
    worker,
    isLoading,
    error,
    recognize,
    terminate,
    ready: !!worker && !isLoading,
  };
}
