'use client';

import { use, useState, useEffect } from 'react';

import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  AlertTriangle,
  Download,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TrackTender({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [activeStep, setActiveStep] = useState(3); // 1: Submitted, 2: Verified, 3: Evaluating, 4: Decision
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([
    { time: '11:45 AM', msg: 'Dossier hashing complete. Linked to Block 8812.' },
    { time: '11:30 AM', msg: 'Technical criteria extracted via GFR Logic-Gates.' },
    { time: '10:15 AM', msg: 'GSTIN verification: SUCCESS.' },
    { time: '09:00 AM', msg: 'Submission received at CRPF Secure Gateway.' },
  ]);

  // Simulate a live log update
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(prev => [{ time: '12:04 PM', msg: 'Evaluation algorithm processing financial turnover...' }, ...prev]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate progress bar and step transition
  useEffect(() => {
    if (activeStep === 3) {
      const startTime = Date.now();
      const duration = 2500; // 2.5 seconds

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setActiveStep(4);
            setLogs(prevLogs => [
              { time: '12:05 PM', msg: '[SYSTEM] Evaluation complete. Final decision hash generated.' },
              ...prevLogs
            ]);
          }, 300);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeStep]);

  const steps = [
    { label: 'Submitted', desc: 'Securely received' },
    { label: 'Verified', desc: 'Auth & KYC check' },
    { label: 'Evaluating', desc: 'AI Logic Processing' },
    { label: 'Decision', desc: 'Final Award Status' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-[#1e40af] text-white px-6 pt-8 pb-12 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="px-3 py-1 bg-blue-500/30 backdrop-blur-md border border-blue-400/30 rounded-full text-[10px] font-black uppercase tracking-widest">
            {id}
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Live Tracking</h1>
          <p className="text-blue-100 text-sm font-medium mt-1">Falcon Constructions Pvt. Ltd.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 -mt-6 px-6 pb-12 space-y-6 relative z-20">
        {/* Progress Stepper */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-50">
          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                {i < steps.length - 1 && (
                  <div className={`absolute left-[15px] top-8 w-0.5 h-10 ${activeStep > i + 1 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  activeStep > i + 1 ? 'bg-emerald-500 text-white' : 
                  activeStep === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  {activeStep > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-black">{i + 1}</span>}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${activeStep === i + 1 ? 'text-blue-600' : 'text-slate-900'}`}>{step.label}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{step.desc}</p>
                </div>
                {activeStep === i + 1 && (
                  <div className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Active</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Log */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-12 h-12 text-blue-400" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Secure Audit Ledger</h2>
          </div>
          <div className="space-y-4 font-mono text-[10px] h-32 overflow-y-auto custom-scrollbar pr-2">
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 text-slate-300"
              >
                <span className="text-emerald-500 font-bold shrink-0">{log.time}</span>
                <span className="leading-relaxed"> {log.msg} </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action / Result Card (Simulated Rejected State for Demo) */}
        {id === 'NSG-T001' ? (
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-black text-rose-700 uppercase tracking-widest">Final Decision: Rejected</span>
              </div>
              <span className="text-[9px] font-bold text-rose-400">02 APR 2026</span>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Your bid was technically disqualified under <span className="font-bold text-slate-900">Clause 4.2 (Annual Turnover)</span>.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-400 uppercase">Decision Hash</span>
                  <span className="font-mono text-blue-600 truncate max-w-[120px]">8812...F9A2</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-400 uppercase">Verification Ledger</span>
                  <span className="text-slate-900 font-bold tracking-tighter underline">View Audit Trail</span>
                </div>
              </div>
              <button className="w-full h-12 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm active:scale-[0.98] transition-all">
                <Download className="w-4 h-4" />
                Download GFR Notice
              </button>
            </div>
          </div>
        ) : activeStep === 4 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-600/30"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Evaluation Complete</h3>
                <p className="text-emerald-50 text-[11px] font-medium mt-1">AI Audit successfully processed. Your bid is now ready for Director approval.</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link 
                href="/dossier-preview" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-white text-emerald-700 font-bold rounded-xl text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center"
              >
                View Decision Dossier
              </Link>
              <a 
                href="/demo_assets/Final_Decision_Dossier.pdf"
                download="Final_Decision_Dossier.pdf"
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Evaluation in Progress</h3>
                <p className="text-blue-100 text-[11px] font-medium mt-1">The government AI is currently verifying your financial dossier against GFR standards.</p>
              </div>
            </div>
            <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-white" 
              />
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-black uppercase tracking-widest">
              <span>AI Engine Confidence: 98%</span>
              <span>Est. Result: {progress < 100 ? '< 3 SECONDS' : 'READY'}</span>
            </div>
          </div>
        )}

        <button className="w-full py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center hover:text-slate-600 transition-colors">
          Need Help? Contact Portal Support
        </button>
      </main>
    </div>
  );
}
