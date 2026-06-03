import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toast: null,
  showToast: (message, type = 'info', duration = 4000) => {
    const currentToast = get().toast;
    if (currentToast?.timeoutId) {
      clearTimeout(currentToast.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      set({ toast: null });
    }, duration);

    set({ toast: { message, type, timeoutId } });
  },
  hideToast: () => {
    const currentToast = get().toast;
    if (currentToast?.timeoutId) {
      clearTimeout(currentToast.timeoutId);
    }
    set({ toast: null });
  }
}));

export default useToastStore;
