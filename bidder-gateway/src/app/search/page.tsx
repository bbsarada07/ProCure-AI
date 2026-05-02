'use client';

import React from 'react';
import { Search, ChevronRight, Clock, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '../../components/BottomNav';
import { TopNav } from '../../components/TopNav';
import { useState } from 'react';

const MOCK_RESULTS = [
  { 
    id: 'CRPF-T004', 
    department: 'CRPF Construction Division', 
    title: 'Perimeter Wall Refurbishment - Northern Sector', 
    status: 'In Evaluation', 
    date: '24 Apr 2026',
    category: 'Active Tenders'
  },
  { 
    id: 'BSF-T012', 
    department: 'Border Security Force', 
    title: 'Surveillance Tower IT Infrastructure', 
    status: 'Draft', 
    date: '30 Apr 2026',
    category: 'Active Tenders'
  },
  { 
    id: 'MES-T091', 
    department: 'Military Engineer Services', 
    title: 'Cantonment Residential Complex', 
    status: 'Awarded', 
    date: '15 Mar 2026',
    category: 'Awarded'
  }
];

const FILTERS = ["All", "Active Tenders", "Evaluations in Progress", "Awarded"];

export default function SearchPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = MOCK_RESULTS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-20">
      <TopNav />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Search Tenders</h1>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tenders, IDs, or agencies..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-sm font-medium transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-50 rounded-full"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === filter 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
            {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'} Found
          </p>

          <AnimatePresence mode="popLayout">
            {filteredResults.map((tender, i) => (
              <motion.div
                key={tender.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={tender.status === 'Draft' ? `/submit/${tender.id}` : `/track/${tender.id}`}>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{tender.id}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        tender.status === 'Awarded' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        tender.status === 'In Evaluation' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-50 text-slate-700 border-slate-100'
                      }`}>
                        {tender.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {tender.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{tender.department}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {tender.date}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredResults.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No results found</h3>
              <p className="text-xs text-slate-400 mt-1 px-10">We couldn't find any tenders matching your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
