'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10 space-y-8"
      >
        {/* Visual Icon */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/10 border border-blue-50 relative">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl opacity-5 animate-pulse-slow"></div>
            <FileQuestion className="w-12 h-12 text-[#1e40af]" />
            <div className="absolute -top-2 -right-2">
              <span className="flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500 items-center justify-center">
                  <ShieldAlert className="w-3.5 h-3.5 text-white" />
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
            404 - <span className="text-[#1e40af]">Sector</span> Not Found
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-slate-200"></div>
            <p className="text-[#64748b] font-bold text-xs uppercase tracking-[0.2em]">Security Protocol Triggered</p>
            <div className="h-px w-8 bg-slate-200"></div>
          </div>
          <p className="text-[#64748b] text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
            The requested document or coordinate could not be located in the secure ledger. This path may have been decommissioned or moved to a higher security clearance zone.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link href="/tender-dna-compiler">
            <button className="w-full h-14 bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 group cursor-pointer">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Return to Command Center
            </button>
          </Link>
          
          <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 inline-block">
            <p className="text-[10px] font-mono text-slate-400 font-bold tracking-tight">
              ERR_CODE: LEDGER_RESOURCE_MISMATCH_v2026
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
        <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
          <FileQuestion className="w-3 h-3 text-white" />
        </div>
        <span className="font-black text-xs tracking-tight text-slate-900 uppercase">Procure<span className="text-blue-600">AI</span></span>
      </div>
    </div>
  );
}
