import React from 'react';

const ErrorModal = ({ isOpen, errorCode, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-gradient-to-b from-black via-[#0b0b0d] to-black border border-red-600/30 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full"></div>

        {/* Content */}
        <div className="relative z-10">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-red-600/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center">
                <span className="text-2xl text-red-500">⚠</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {title || 'Error'}
                </h2>
                {errorCode && (
                  <p className="text-sm text-red-400">Code: {errorCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="px-6 py-4">
            <p className="text-gray-300 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-red-600/20 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
