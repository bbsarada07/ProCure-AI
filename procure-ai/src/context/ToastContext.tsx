'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto min-w-[320px]"
          >
            <div className={`p-1.5 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-500' :
              toast.type === 'info' ? 'bg-blue-500' :
              toast.type === 'warning' ? 'bg-amber-500' :
              'bg-rose-500'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-white" />}
              {toast.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-white" />}
              {toast.type === 'error' && <XCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
