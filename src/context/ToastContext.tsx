'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastItem {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (message: string, type?: ToastItem['type']) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = ++nextId;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}
