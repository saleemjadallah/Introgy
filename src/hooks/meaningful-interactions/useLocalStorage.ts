
import { useCallback } from 'react';

export function useLocalStorage() {
  // Save to localStorage asynchronously to prevent blocking UI
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    // Use setTimeout to move localStorage operations off the main thread
    setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    }, 0);
  }, []);

  return { saveToLocalStorage };
}
