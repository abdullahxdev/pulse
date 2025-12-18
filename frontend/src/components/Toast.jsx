import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertCircle size={20} className="text-yellow-500" />
  };

  const colors = {
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
    info: 'border-blue-500 bg-blue-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10'
  };

  return (
    <div className={`fixed top-20 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 ${colors[type]} backdrop-blur-sm shadow-xl animate-[slideInRight_0.3s_ease] min-w-[300px]`}>
      {icons[type]}
      <span className="text-sm text-neutral-50 font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-50 transition-colors"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
