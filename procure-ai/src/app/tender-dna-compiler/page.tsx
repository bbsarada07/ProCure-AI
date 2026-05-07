'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  Upload, 
  Dna,
  FileCheck,
  ArrowRight,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TenderDNACompiler() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const mockLogs = [
    '[SYSTEM] Initializing GFR-2026 Compliance Protocol...',
    '[SYSTEM] Secure tunnel established with National Procurement Ledger.',
    '[AI] Scanning document for technical specifications...',
    '[AI] Identifying MSE/MSME preference markers...',
    '[SYSTEM] Parsing Clause 4.2: Experience Eligibility...',
    '[MATH] Calculating 3-year average turnover...',
    '[AI] Verifying MSME Turnover threshold: MATCH FOUND.',
    '[MATH] Calculating 15% margin preference: VERIFIED.',
    '[SECURE] Cryptographic verification of digital signature...',
    '[AI] Cross-referencing GSTIN Active Status...',
    '[SYSTEM] Validating PAN/Tax-Compliance vectors...',
    '[SECURE] SHA-256 hash generated: 8f9a2e...d1c4b8',
    '[SYSTEM] Structuring finalized decision dossier...',
    '[SUCCESS] Tender DNA extraction complete.'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const startExtraction = () => {
    if (!selectedFile) return;
    setIsExtracting(true);
    setIsFinished(false);
    setLogs([]);
  };

  useEffect(() => {
    if (isExtracting && logs.length < mockLogs.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, mockLogs[logs.length]]);
      }, 400 + Math.random() * 800); 
      return () => clearTimeout(timer);
    } else if (isExtracting && logs.length === mockLogs.length) {
      setTimeout(() => {
        setIsExtracting(false);
        setIsFinished(true);
      }, 1000);
    }
  }, [isExtracting, logs.length]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header Bar */}
      <nav className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1e40af] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">
              Procure<span className="text-[#1e40af]">AI</span>
            </h1>
            <p className="text-[10px] font-bold text-[#64748b] tracking-[0.2em] mt-0.5">Government Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase text-slate-400">Node: DEL-HQ-01</span>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Database className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </nav>

      <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#1e40af] mb-2">
              <Dna className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Flagship Component</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tender <span className="text-[#1e40af]">DNA</span> Compiler</h2>
            <p className="text-slate-500 font-medium">Immutable AI-driven extraction and multi-dimensional audit verification.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Version</p>
              <p className="text-sm font-bold text-slate-900 font-mono">v4.2.0-STABLE</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#1e40af]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Document Ingestion</h3>
              </div>

              <div 
                className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  selectedFile ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/20'
                }`}
              >
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{selectedFile.name}</p>
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-1">Ready for Compilation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-md border border-slate-100">
                      <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Drag & Drop Tender Dossier</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Supports PDF, DOCX, TXT, and Secure Images</p>
                    </div>
                    <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm hover:border-blue-300 transition-colors">
                      Browse Files
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <button 
                  onClick={startExtraction}
                  disabled={!selectedFile || isExtracting || isFinished}
                  className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${
                    isExtracting ? 'bg-blue-600 text-white shadow-blue-900/20' : 
                    isFinished ? 'bg-emerald-500 text-white shadow-emerald-900/20' :
                    selectedFile ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-black' :
                    'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Extracting GFR Criteria...
                    </>
                  ) : isFinished ? (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Extraction Finalized
                    </>
                  ) : (
                    <>
                      <Terminal className="w-6 h-6" />
                      Commence DNA Extraction
                    </>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isFinished && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/20 flex items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-bold leading-none">Security Audit Pass</p>
                      <p className="text-emerald-100 text-xs font-medium mt-1">All criteria extracted and verified against GFR-2026.</p>
                    </div>
                  </div>
                  <Link href="/dashboard">
                    <button className="px-6 h-12 bg-white text-emerald-700 font-bold rounded-xl text-sm shadow-sm hover:bg-emerald-50 transition-all flex items-center gap-2 whitespace-nowrap">
                      View Final Dossier
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Cryptographic Evaluation Ledger</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-3">
              {logs.length === 0 && !isExtracting && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <Terminal className="w-12 h-12 text-slate-700" />
                  <p className="text-slate-500 max-w-[200px]">Waiting for ingestion to initialize audit stream...</p>
                </div>
              )}
              
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 border-l-2 border-slate-800 pl-4 py-1"
                >
                  <span className="text-slate-600 font-bold shrink-0">[{i.toString().padStart(3, '0')}]</span>
                  <span className={`${
                    log.includes('[SYSTEM]') ? 'text-blue-400' :
                    log.includes('[AI]') ? 'text-indigo-400' :
                    log.includes('[MATH]') ? 'text-emerald-400' :
                    log.includes('[SECURE]') ? 'text-amber-400' :
                    log.includes('[SUCCESS]') ? 'text-emerald-500 font-black' :
                    'text-slate-300'
                  }`}>
                    {log}
                  </span>
                </motion.div>
              ))}
              <div ref={logEndRef} />
            </div>

            <div className="bg-slate-800/30 px-6 py-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isExtracting ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
                  <span>Status: {isExtracting ? 'PROCESSING_DNA' : isFinished ? 'IDLE_FINALIZED' : 'WAITING_INPUT'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Latency: 24ms</span>
                  <div className="h-2 w-12 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500/40 w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
