import { X, Zap } from 'lucide-react';

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  onSignUp?: () => void;
}

/**
 * Modal to prompt users to sign up for premium features
 * Can be triggered when anonymous users try to access protected features
 */
export function SignupPromptModal({
  isOpen,
  onClose,
  feature = 'this feature',
  onSignUp,
}: SignupPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 relative animate-slide-down">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent-glow)' }}>
          <Zap className="w-8 h-8" style={{ color: 'var(--accent)' }} />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-display text-center mb-2" style={{ color: 'var(--text-primary)' }}>Unlock {feature}</h2>
        <p className="text-center mb-8" style={{ color: 'var(--text-muted)' }}>
          Create a free account to access this feature and sync your progress across all devices.
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8 p-5 border rounded-2xl" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--glow-color)]" style={{ background: 'var(--accent)' }} />
            Save your progress
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--glow-color)]" style={{ background: 'var(--accent)' }} />
            Track achievements
          </div>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--glow-color)]" style={{ background: 'var(--accent)' }} />
            Collaborate with others
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onSignUp?.();
              onClose();
            }}
            className="w-full py-3 px-4 text-white font-medium rounded-xl transition-transform hover:scale-[1.02] shadow-lg block"
            style={{ background: 'var(--accent)' }}
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 border font-medium rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5 block"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-center mt-6" style={{ color: 'var(--text-faint)' }}>
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
}
