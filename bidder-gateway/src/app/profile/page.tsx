'use client';

import React from 'react';
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
import { motion } from 'framer-motion';
import { BottomNav } from '../../components/BottomNav';
import { TopNav } from '../../components/TopNav';

export default function ProfilePage() {
  const settingsItems = [
    { icon: Bell, label: 'Notification Preferences', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: FileText, label: 'Manage Uploaded Documents', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Languages, label: 'Language Settings', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Fingerprint, label: 'Security & 2FA', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: LogOut, label: 'Logout', color: 'text-rose-600', bg: 'bg-rose-50' },
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
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Account Settings</h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {settingsItems.map((item, i) => (
              <button 
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
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
    </div>
  );
}
