'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse gap-3 w-[90%] max-w-md pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto border-white/40 mb-1"
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${toast.type === 'success' ? 'bg-emerald-500 text-white' :
                  toast.type === 'info' ? 'bg-blue-500 text-white' :
                    toast.type === 'warning' ? 'bg-amber-500 text-white' :
                      'bg-rose-500 text-white'
                }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {toast.type === 'info' && <Bell className="w-4 h-4" />}
                {toast.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                {toast.type === 'error' && <XCircle className="w-4 h-4" />}
              </div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
