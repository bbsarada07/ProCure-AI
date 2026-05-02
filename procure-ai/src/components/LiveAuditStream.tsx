'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Decrypting payload chunk 4A...",
  "Cross-referencing GSTIN against live portal...",
  "Checking GFR clause 4.2...",
  "SHA-256 Hash generated: 0x7a8b9e2f4c1d0a5b...",
  "Validating ISO-9001:2015 certificate metadata...",
  "Extracting financial turnover from FY 2023-24...",
  "Logic-gate 0x01: Mandatory Criteria Check [PASSED]",
  "Logic-gate 0x02: Experience Threshold Verification...",
  "Analyzing bidder network topology for collusion...",
  "Scanning for duplicate document signatures...",
  "Executing zero-trust DNA compilation...",
  "Mapping extracted data to GFR 2017 standards...",
  "Verifying digital signature of the issuer...",
  "Running anomaly detection on turnover trends...",
  "Compiling immutable audit trail for the ledger...",
  "Syncing with Bharat Portal live nodes...",
  "Updating live evaluation stream for Maker review...",
  "Caching secure session tokens...",
  "Finalizing technical pre-flight check...",
  "Zero-trust verification tunnel established.",
  "Parsing technical dossier for entity disambiguation...",
  "Cross-validating vendor pan-India footprint...",
  "Generating real-time risk-index for GFR triage...",
  "Executing immutable state-lock on verified criteria..."
];

export function LiveAuditStream() {
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing Live DNA AI Audit Tunnel..."]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const addLog = () => {
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
      setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${randomMsg}`]);
      
      const nextDelay = Math.random() * (1200 - 400) + 400;
      timeoutId = setTimeout(addLog, nextDelay);
    };

    timeoutId = setTimeout(addLog, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-50" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live DNA AI Audit Tunnel</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50 hover:bg-red-500/50 transition-colors cursor-pointer" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50 hover:bg-amber-500/50 transition-colors cursor-pointer" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700/50 hover:bg-emerald-500/50 transition-colors cursor-pointer" />
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="h-32 overflow-y-auto p-4 text-[10px] text-green-400/80 space-y-1.5 scroll-smooth selection:bg-green-500/30"
      >
        {logs.map((log, i) => {
          const isSuccess = log.includes('[PASSED]') || log.includes('Verified') || log.includes('established') || log.includes('OK');
          return (
            <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-slate-700 shrink-0 select-none">
                {String(i + 1).padStart(3, '0')}
              </span>
              <span className={cn(
                "break-all",
                isSuccess ? "text-emerald-400 font-bold" : "text-green-400/80"
              )}>
                {log}
              </span>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-1.5 bg-slate-800/30 border-t border-slate-800 flex justify-between items-center">
        <div className="flex gap-3 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Engine: GFR-DNA-2.0</span>
          <span>Buffer: OK</span>
          <span>Sync: ACTIVE</span>
        </div>
        <div className="text-[8px] text-blue-500 font-bold animate-pulse uppercase tracking-tighter">
          Evaluating Live Submissions...
        </div>
      </div>
    </div>
  );
}
