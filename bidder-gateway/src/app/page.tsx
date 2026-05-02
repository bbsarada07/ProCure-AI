'use client';

import React from 'react';
import { Shield, Lock, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#1e40af] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#0f172a] tracking-tight text-center">
            Procure<span className="text-[#1e40af]">AI</span>
          </h1>
          <p className="text-[#64748b] font-bold text-xs uppercase tracking-[0.2em] mt-1">Bidder Gateway</p>
        </div>

        {/* Hero Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] leading-tight">
            Submit, Track, and Win <br />
            Government Tenders
          </h2>
          <p className="text-[#64748b] text-sm mt-2">
            Professional document scanning and live evaluation tracking for SME vendors.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="vendor@company.com"
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              </div>
            </div>

            <Link href="/dashboard" className="block w-full pt-2">
              <button className="w-full h-12 bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20">
                Login to Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or Secure Connect</span>
              </div>
            </div>

            <button className="w-full h-12 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <Building2 className="w-4 h-4" />
              Login with GSTIN
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs text-slate-400 font-medium">
          Powered by National Procurement Ledger. <br />
          Standard GFR Compliance v2026.
        </p>
      </motion.div>
    </div>
  );
}
