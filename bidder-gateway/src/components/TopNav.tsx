'use client';

import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  X, 
  Home, 
  FileText, 
  Briefcase, 
  LifeBuoy, 
  LogOut,
  Shield
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'My Submissions', href: '/dashboard' },
    { icon: Briefcase, label: 'Active Tenders', href: '/search' },
    { icon: LifeBuoy, label: 'Help & Support', href: '/dashboard' },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            className="p-2 -ml-2 active:bg-slate-50 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-black text-lg tracking-tight">My<span className="text-blue-600">Bids</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="relative p-2 active:bg-slate-50 rounded-full transition-colors"
            onClick={() => showToast('No new notifications', 'success')}
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <Link href="/profile">
            <button 
              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 active:scale-90 transition-transform"
            >
              <User className="w-4 h-4 text-blue-600" />
            </button>
          </Link>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            
            {/* Sidebar */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-xl tracking-tight">My<span className="text-blue-600">Bids</span></span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-bold transition-all group">
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-50">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    showToast('Logged out successfully', 'success');
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-600 font-bold hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
