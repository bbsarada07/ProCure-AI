'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  Building2, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  FileText, 
  Languages, 
  LogOut,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '../../components/BottomNav';
import { TopNav } from '../../components/TopNav';

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [debugText, setDebugText] = useState('Account Settings');
  const [showDemoToast, setShowDemoToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleDemoClick = () => {
    setDebugText('Demo Clicked: ' + new Date().toLocaleTimeString());
    
    // Reset timer if already showing
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setShowDemoToast(true);
    
    timerRef.current = setTimeout(() => {
      setShowDemoToast(false);
      timerRef.current = null;
    }, 3000);
  };

  const handleLogout = () => {
    setDebugText('Logout Clicked');
    localStorage.clear();
    router.push('/');
  };

  const settingsItems = [
    { icon: Bell, label: 'Notification Preferences', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: FileText, label: 'Manage Uploaded Documents', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Languages, label: 'Language Settings', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Fingerprint, label: 'Security & 2FA', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: LogOut, label: 'Logout', color: 'text-rose-600', bg: 'bg-rose-50', isLogout: true },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-20">
      <TopNav />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Profile</h1>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="relative flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-md mb-4">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Falcon Constructions</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              GSTIN Verified: Active
            </div>
          </div>

          <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">GSTIN Number</p>
                <p className="text-sm font-bold text-slate-700">07AAAAA0000A1Z5</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registered Address</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  12th Floor, Skyline Towers, Sector 44, <br />
                  Gurugram, Haryana - 122003
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact Email</p>
                <p className="text-sm font-bold text-slate-700">ops@falconinfra.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">{debugText}</h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative z-20">
            {settingsItems.map((item, i) => (
              <button 
                key={item.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.isLogout) handleLogout();
                  else handleDemoClick();
                }}
                className="w-full flex items-center justify-between p-4 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] border-b border-slate-50 last:border-b-0 group cursor-pointer relative z-[60]"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="pt-4 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            ProcureAI v2.4.0 (Statutory Build)
          </p>
        </div>
      </div>

      <BottomNav />

      {/* Single Instance Demo Toast */}
      <AnimatePresence>
        {showDemoToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 whitespace-nowrap"
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-sm font-bold tracking-tight">
              🔒 Security Clearance Required: Feature restricted in Demo Environment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
