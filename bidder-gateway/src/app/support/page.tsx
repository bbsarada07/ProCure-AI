'use client';

import React from 'react';
import { Hammer } from 'lucide-react';
import { TopNav } from '../../components/TopNav';
import { BottomNav } from '../../components/BottomNav';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <TopNav />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pb-32">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Hammer className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Coming Soon</h1>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          The Help & Support page is currently under development. Please check back later.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
