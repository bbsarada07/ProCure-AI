'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Menu,
  Bell,
  User,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '../../components/BottomNav';
import { TopNav } from '../../components/TopNav';


const TENDERS = [
  { 
    id: 'CRPF-T004', 
    department: 'CRPF Construction Division', 
    title: 'Perimeter Wall Refurbishment - Northern Sector', 
    status: 'In Evaluation', 
    date: '24 Apr 2026',
    color: 'blue'
  },
  { 
    id: 'BSF-T012', 
    department: 'Border Security Force', 
    title: 'Surveillance Tower IT Infrastructure', 
    status: 'Draft', 
    date: '30 Apr 2026',
    color: 'slate'
  },
  { 
    id: 'MES-T091', 
    department: 'Military Engineer Services', 
    title: 'Cantonment Residential Complex', 
    status: 'Awarded', 
    date: '15 Mar 2026',
    color: 'emerald'
  },
  { 
    id: 'NSG-T001', 
    department: 'NSG Logistics Hub', 
    title: 'Specialized Tactical Gear Supply', 
    status: 'Rejected', 
    date: '02 Apr 2026',
    color: 'rose'
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'In Evaluation': 'bg-blue-50 text-blue-700 border-blue-100',
    'Draft': 'bg-slate-50 text-slate-700 border-slate-100',
    'Awarded': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const icons: Record<string, any> = {
    'In Evaluation': <Clock className="w-3 h-3" />,
    'Draft': <Plus className="w-3 h-3" />,
    'Awarded': <CheckCircle2 className="w-3 h-3" />,
    'Rejected': <XCircle className="w-3 h-3" />,
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
      {icons[status]}
      {status}
    </div>
  );
};

import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

export default function Dashboard() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredTenders = TENDERS.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, showAll ? TENDERS.length : 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <TopNav />

      <main className="flex-1 p-6 space-y-6 pb-32">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bidder Portal</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Good morning, Falcon Constructions</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID or Department..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-sm font-medium transition-all"
          />
        </div>

        {/* Tender List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              {searchTerm ? `Search Results (${filteredTenders.length})` : 'Active Tenders'}
            </h2>
            <button 
              onClick={() => {
                setShowAll(!showAll);
                showToast(showAll ? 'Showing recent tenders' : 'Showing all tenders', 'info');
              }}
              className="text-xs font-bold text-blue-600 active:text-blue-800 transition-colors"
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredTenders.length > 0 ? filteredTenders.map((tender, i) => (
              <motion.div 
                key={tender.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={tender.status === 'Draft' ? `/submit/${tender.id}` : `/track/${tender.id}`}>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{tender.id}</span>
                      <StatusBadge status={tender.status} />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {tender.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{tender.department}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        Updated {tender.date}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        {tender.status === 'Draft' ? 'Finish Submission' : 'Track Status'}
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No tenders found</h3>
                <p className="text-xs text-slate-400 mt-1">Try searching with a different ID or keyword.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button for Mobile */}
        <Link href="/submit/BSF-T012">
          <button 
            className="fixed bottom-28 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-transform z-40"
            title="Start New Submission"
          >
            <Plus className="w-6 h-6" />
          </button>
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}


