'use client';

import React from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BottomNav } from '../../components/BottomNav';
import { TopNav } from '../../components/TopNav';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Pre-Flight Check Passed',
    message: 'Pre-Flight Check Passed for CRPF-T004.',
    time: '2 mins ago',
    icon: CheckCircle2,
    color: 'emerald',
    tenderId: 'CRPF-T004'
  },
  {
    id: 2,
    type: 'info',
    title: 'Evaluation Started',
    message: 'Evaluation phase has begun for MES-T091.',
    time: '1 hour ago',
    icon: Info,
    color: 'blue',
    tenderId: 'MES-T091'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Clarification Requested',
    message: 'Clarification requested regarding GSTIN on BSF-T012.',
    time: '3 hours ago',
    icon: AlertTriangle,
    color: 'amber',
    tenderId: 'BSF-T012'
  }
];

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-20">
      <TopNav />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications & Alerts</h1>
          <div className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
            <Bell className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        <div className="space-y-4">
          {NOTIFICATIONS.map((notif, i) => {
            const Icon = notif.icon;
            const colorClass = 
              notif.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              notif.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
              'bg-amber-50 text-amber-600 border-amber-100';
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/track/${notif.tenderId}`}>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 active:scale-[0.98] transition-all cursor-pointer group">
                    <div className={`p-3 rounded-2xl border ${colorClass} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{notif.title}</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {notif.message}
                      </p>
                      <div className="pt-2 flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state for older notifications */}
        <div className="pt-8 text-center">
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            No older notifications
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
