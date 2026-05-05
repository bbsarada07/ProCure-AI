'use client';

import { use, useState, useEffect, useRef } from 'react';

import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '../../../components/BottomNav';

export default function SubmitTender({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isBatchScanning, setIsBatchScanning] = useState(false);
  const [docStates, setDocStates] = useState<Record<string, 'idle' | 'uploading' | 'parsing' | 'verified'>>({
    financials: 'idle',
    technical: 'idle',
    compliance: 'idle'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerDocFlow = (id: string) => {
    setDocStates(prev => ({ ...prev, [id]: 'uploading' }));
    setTimeout(() => {
      setDocStates(prev => ({ ...prev, [id]: 'parsing' }));
      setTimeout(() => {
        setDocStates(prev => ({ ...prev, [id]: 'verified' }));
      }, 1500);
    }, 1500);
  };

  const allVerified = Object.values(docStates).every(s => s === 'verified');

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(3);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleScan = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsBatchScanning(true);
      
      // Stage 1: Batch Vision Processing
      setTimeout(() => {
        setIsBatchScanning(false);
        setIsScanning(true);
        
        // Stage 2: Individual Row Uploading
        setDocStates({
          financials: 'uploading',
          technical: 'uploading',
          compliance: 'uploading'
        });

        setTimeout(() => {
          // Stage 3: AI Parsing
          setDocStates({
            financials: 'parsing',
            technical: 'parsing',
            compliance: 'parsing'
          });

          setTimeout(() => {
            // Stage 4: Verified
            setDocStates({
              financials: 'verified',
              technical: 'verified',
              compliance: 'verified'
            });
            setIsScanning(false);
          }, 2000);
        }, 2000);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 h-16 flex items-center gap-4 sticky top-0 z-30">
        <Link href="/dashboard">
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">{id}</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">New Submission Flow</p>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-50">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
              step === s ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/20' : 
              step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
          </div>
        ))}
      </div>

      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Documents</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Please provide the required dossiers for AI pre-flight verification.</p>
              </div>

              {/* Dropzones */}
              <div className="space-y-4">
                {[
                  { id: 'financials', label: 'Financial Statements (3 Years)', icon: <FileText className="w-5 h-5" />, extraction: "Extracted: ₹6.2 Cr Average Turnover" },
                  { id: 'technical', label: 'Past Experience Certificates', icon: <FileText className="w-5 h-5" />, extraction: "Extracted: 3 Similar Projects Found" },
                  { id: 'compliance', label: 'Statutory Compliance / GSTIN', icon: <ShieldCheck className="w-5 h-5" />, extraction: "Extracted: GSTIN Active - 07AAAAA0000A1Z5" },
                ].map((item) => {
                  const status = docStates[item.id];
                  return (
                    <div key={item.id} className="relative group">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        accept="image/*,application/pdf"
                        capture="environment"
                        onChange={() => triggerDocFlow(item.id)} 
                      />
                      <div className={`p-4 rounded-3xl border-2 border-dashed transition-all flex items-center justify-between ${
                        status === 'verified' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 
                        status === 'uploading' || status === 'parsing' ? 'bg-blue-50 border-blue-200 animate-pulse' :
                        'bg-white border-slate-100 group-hover:border-blue-400 group-hover:bg-blue-50/30'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                            status === 'verified' ? 'bg-emerald-500 text-white' : 
                            status === 'uploading' || status === 'parsing' ? 'bg-blue-600 text-white' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {status === 'uploading' || status === 'parsing' ? <Loader2 className="w-5 h-5 animate-spin" /> : item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{item.label}</p>
                            <div className="mt-0.5">
                              {status === 'idle' && (
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Tap to select or scan</p>
                              )}
                              {status === 'uploading' && (
                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Uploading Document...</p>
                              )}
                              {status === 'parsing' && (
                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">AI Engine Parsing...</p>
                              )}
                              {status === 'verified' && (
                                <div className="space-y-0.5">
                                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Verification Complete</p>
                                  <p className="text-[11px] font-bold text-slate-600 bg-emerald-100/50 inline-block px-1.5 rounded-md">{item.extraction}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {status === 'verified' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Upload className={`w-5 h-5 ${status === 'uploading' || status === 'parsing' ? 'text-blue-400 animate-bounce' : 'text-slate-300'}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*,application/pdf,image/svg+xml"
                  capture="environment"
                  className="hidden"
                  onChange={handleCameraCapture}
                />
                {allVerified ? (
                  <motion.button 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setStep(2)}
                    className="w-full h-16 bg-[#1e40af] text-white rounded-3xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all"
                  >
                    Proceed to Final Review
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <button 
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isScanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                    {isScanning ? 'Initializing OCR Scanner...' : 'Open Camera / Scan Document'}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-[50vh] text-center"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
                <div className="relative w-24 h-24 bg-white border border-blue-100 rounded-full flex items-center justify-center shadow-2xl">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">AI Auto-Structuring</h2>
              <p className="text-sm text-slate-500 mt-2 px-10 leading-relaxed font-medium">
                Our AI is currently extracting criteria and organizing your documents for the Secure Ledger.
              </p>
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest animate-pulse">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Extracting Financial Data...
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  Verifying GFR Compliance...
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pre-Flight Check</h2>
                <p className="text-sm text-slate-500 font-medium">Review the data extracted from your scans before final submission.</p>
              </div>

              {/* Extraction Results */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">AI Audit Passed</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Extracted Turnover</span>
                    <span className="text-sm font-black text-slate-900">₹6.20 Crore (Avg.)</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience Match</span>
                    <span className="text-sm font-black text-slate-900">4 Major Projects Found</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PAN/GSTIN Match</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">VERIFIED</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning (Mock) */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  <span className="font-bold">Notice:</span> Ensure all pages are clearly visible in the source scans to avoid automated audit mismatches.
                </p>
              </div>

              {/* Final Action */}
              <Link 
                href="/track/CRPF-T004" 
                className="block"
                onClick={() => {
                  localStorage.setItem('demo_tender_status', 'submitted');
                }}
              >
                <button className="w-full h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all">
                  <ShieldAlert className="w-6 h-6 text-blue-400" />
                  Submit to Secure Ledger
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <button 
                onClick={() => setStep(1)}
                className="w-full h-12 text-slate-400 text-sm font-bold hover:text-slate-600"
              >
                Scan More Documents
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Batch Scan Overlay */}
      <AnimatePresence>
        {isBatchScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="relative mb-8">
              <div className="w-32 h-32 border-4 border-blue-500/30 rounded-3xl animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-12 h-12 text-blue-400 animate-bounce" />
              </div>
              <motion.div 
                animate={{ 
                  top: ['0%', '100%', '0%'],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
              />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Vision Scanning...</h2>
            <p className="text-blue-200 mt-4 font-medium leading-relaxed max-w-xs">
              Detecting physical document boundaries and extracting high-fidelity structural metadata.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`px-2 py-0.5 rounded flex items-center justify-center ${className}`}>
    {children}
  </div>
);
