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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-center mb-2">Unlock {feature}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Create a free account to access this feature and sync your progress across all devices.
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-300">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            Save your progress
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-300">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            Track achievements
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-300">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
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
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
}
