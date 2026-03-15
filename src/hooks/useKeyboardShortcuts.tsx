import { useEffect } from 'react';

/**
 * Keyboard Shortcuts Hook
 * Define and manage keyboard shortcuts throughout the app
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Unless it's a specific shortcut like Escape or Ctrl+Enter
        if (e.key !== 'Escape' && !(e.ctrlKey && e.key === 'Enter')) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          e.ctrlKey === (shortcut.ctrlKey ?? false) &&
          e.shiftKey === (shortcut.shiftKey ?? false) &&
          e.altKey === (shortcut.altKey ?? false)
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Default application shortcuts
 */
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: '/',
    description: 'Focus search/input',
    action: () => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      input?.focus();
    },
  },
  {
    key: 'Escape',
    description: 'Close modals/Clear input',
    action: () => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
  },
  {
    key: 'Enter',
    ctrlKey: true,
    description: 'Solve problem (in Solver tab)',
    action: () => {
      const solveBtn = document.querySelector('button[title*=olve]') as HTMLButtonElement;
      solveBtn?.click();
    },
  },
  {
    key: 's',
    ctrlKey: true,
    description: 'Export/Save solution',
    action: () => {
      const shareBtn = document.querySelector('button:contains(Share)') as HTMLButtonElement ||
                       Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Share')) as HTMLButtonElement;
      shareBtn?.click();
    },
  },
  {
    key: 'h',
    ctrlKey: true,
    description: 'Go to History tab',
    action: () => {
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'history' }));
    },
  },
  {
    key: 'e',
    ctrlKey: true,
    description: 'Go to Examples tab',
    action: () => {
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'examples' }));
    },
  },
  {
    key: '?',
    shiftKey: true,
    description: 'Show keyboard shortcuts help',
    action: () => {
      window.dispatchEvent(new CustomEvent('show-shortcuts-help'));
    },
  },
];

/**
 * Display shortcuts help modal
 */
export function ShortcutsHelp({ shortcuts = DEFAULT_SHORTCUTS }: { shortcuts?: KeyboardShortcut[] }) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      <p className="text-sm text-gray-400 mb-4">Available Keyboard Shortcuts:</p>
      {shortcuts.map((shortcut, i) => (
        <div key={i} className="flex items-start justify-between gap-4 p-2 rounded bg-white/5">
          <span className="text-sm text-gray-300">{shortcut.description}</span>
          <div className="flex gap-1 text-xs font-mono bg-white/10 px-2 py-1 rounded">
            {shortcut.ctrlKey && <span className="text-indigo-300">Ctrl</span>}
            {shortcut.shiftKey && <span className="text-indigo-300">Shift</span>}
            {shortcut.altKey && <span className="text-indigo-300">Alt</span>}
            {(shortcut.ctrlKey || shortcut.shiftKey || shortcut.altKey) && <span>+</span>}
            <span className="text-indigo-400">{shortcut.key}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
