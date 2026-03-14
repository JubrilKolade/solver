/**
 * Service Worker Registration Utilities
 * Enables offline support and caching
 */

/**
 * Register service worker for offline support
 */
export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available, notify user
          console.log('New version available! Refresh to update.');
          window.dispatchEvent(
            new CustomEvent('sw-update-available', {
              detail: { registration },
            })
          );
        }
      });
    });
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

/**
 * Unregister all service workers
 */
export async function unregisterServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('All Service Workers unregistered');
  } catch (error) {
    console.error('Failed to unregister Service Workers:', error);
  }
}

/**
 * Check if app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline changes
 */
export function onConnectivityChange(callback: (isOnline: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return unsubscribe function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Store data in IndexedDB for offline use
 */
export const offlineDB = {
  async saveHistory(items: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MathSolverDB', 1);
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'timestamp' });
        }
      };
    });
  },

  async getHistory(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MathSolverDB', 1);
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('history', 'readonly');
        const store = tx.objectStore('history');
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async clearHistory(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MathSolverDB', 1);
      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const tx = db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
  },
};
