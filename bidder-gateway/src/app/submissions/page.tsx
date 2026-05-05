'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  FileText,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TopNav } from '../../components/TopNav';
import { BottomNav } from '../../components/BottomNav';

const SUBMISSIONS = [
  {
    tenderId: 'CRPF-2026-004',
    title: 'Perimeter Wall Refurbishment - Northern Sector',
    authority: 'CRPF Construction Division',
    submittedDate: 'May 2, 2026',
    status: 'In Evaluation'
  },
  {
    tenderId: 'MES-2026-091',
    title: 'Cantonment Residential Complex',
    authority: 'Military Engineer Services',
    submittedDate: 'Apr 28, 2026',
    status: 'Awarded'
  },
  {
    tenderId: 'BSF-2026-012',
    title: 'Surveillance Tower IT Infrastructure',
    authority: 'Border Security Force',
    submittedDate: 'May 4, 2026',
    status: 'Action Required'
  },
  {
    tenderId: 'NSG-2026-001',
    title: 'Specialized Tactical Gear Supply',
    authority: 'NSG Logistics Hub',
    submittedDate: 'Apr 15, 2026',
    status: 'Rejected'
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'In Evaluation':
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
          <Clock className="w-3 h-3" />
          {status}
        </div>
      );
    case 'Awarded':
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
          <CheckCircle2 className="w-3 h-3" />
          {status}
        </div>
      );
    case 'Rejected':
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
          <XCircle className="w-3 h-3" />
          {status}
        </div>
      );
    case 'Action Required':
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 border border-orange-300 text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
          <AlertCircle className="w-3 h-3 text-orange-500" />
          {status}
        </div>
      );
    default:
      return null;
  }
};

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'In Evaluation', 'Awarded', 'Action Required'];

  const filteredSubmissions = SUBMISSIONS.filter(sub => {
    if (activeTab === 'All') return true;
    return sub.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <TopNav />

      <main className="flex-1 flex flex-col p-6 pb-32">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            My Submissions
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
            Track the real-time AI evaluation status of your tender dossiers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2 -mx-2 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredSubmissions.length > 0 ? filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.tenderId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative group overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {submission.tenderId}
                    </span>
                    <StatusBadge status={submission.status} />
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 leading-snug pr-4 mb-1">
                    {submission.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mb-4">
                    {submission.authority}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Submitted {submission.submittedDate}
                    </div>
                    
                    <Link href={`/track/${submission.tenderId}`}>
                      <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight transition-all text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg active:scale-95">
                        {submission.status === 'Action Required' ? 'View Ledger' : 'Track Status'}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <Search className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No submissions found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  You have no dossiers currently marked as '{activeTab}'.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
