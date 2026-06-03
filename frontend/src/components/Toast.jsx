import React from 'react';
import useToastStore from '../store/toastStore';

const Toast = () => {
  const { toast, hideToast } = useToastStore();

  if (!toast) return null;

  const { message, type } = toast;

  let bgColor = 'bg-[#161B22]/95 border-gray-800 text-gray-200';
  let icon = 'info';
  let iconColor = 'text-sky-400';

  if (type === 'success') {
    bgColor = 'bg-emerald-950/95 border-emerald-800/40 text-emerald-100';
    icon = 'check_circle';
    iconColor = 'text-emerald-400';
  } else if (type === 'error') {
    bgColor = 'bg-rose-950/95 border-rose-800/40 text-rose-100';
    icon = 'error';
    iconColor = 'text-rose-400';
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up" style={{ pointerEvents: 'auto' }}>
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm ${bgColor}`}>
        <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
        <span className="text-sm font-semibold flex-1 leading-relaxed">{message}</span>
        <button 
          onClick={hideToast}
          className="text-gray-400 hover:text-white transition-colors focus:outline-none flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
