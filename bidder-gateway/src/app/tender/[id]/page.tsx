'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { 
  ArrowLeft, 
  Check, 
  Lock, 
  UploadCloud, 
  File, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

// Next.js 15 unwrapping pattern for dynamic route parameters
export default function TenderSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  return <TenderClient id={unwrappedParams.id} />;
}

// ----------------------------------------------------
// REDLINES MOCK DATA (High-Fidelity GFR-compliance feedback)
// ----------------------------------------------------
interface RedlineItem {
  id: number;
  risk: string;
  explanation: string;
  redlineText: string;
}

const REDLINES: RedlineItem[] = [
  {
    id: 1,
    risk: "Annual Turnover Under-Threshold (Violation of GFR Clause 2.1)",
    explanation: "Clause 2.1 requires an average annual turnover of ₹5,00,00,000/- (5 Crore) during the last 3 consecutive financial years. Your uploaded income statement registers a mean turnover of only ₹4,80,00,000/-.",
    redlineText: "Bidder must submit a consolidated parent company revenue certification, or register a Joint Venture (JV) partnership form reflecting a combined statutory average turnover of not less than ₹5,00,00,000/-."
  },
  {
    id: 2,
    risk: "Non-Compliant Masonry Experience (Violation of Clause 2.2)",
    explanation: "Clause 2.2 stipulates the completion of at least one similar work (perimeter wall masonry) over 2 kilometers in length. The uploaded completions only show general asphalt road resurfacing contracts.",
    redlineText: "Provide Annexure D (Work Completion Certificate) specifically for reinforced concrete perimeter masonry completed between 2023-2025, authenticated by an officer not below the rank of Executive Engineer."
  },
  {
    id: 3,
    risk: "Statutory Tax Clearance Discrepancy (Violation of Clause 2.3)",
    explanation: "The trade name listed on the uploaded active GSTIN registration document registers 'Falcon Logistics LLC', which mismatches the bidding entity 'Falcon Constructions Limited'.",
    redlineText: "Upload a valid GST REG-06 registration certificate showing identical trade name matching 'Falcon Constructions Limited' as registered in the main Bid Form."
  }
];

type StepState = 'pre-flight' | 'upload' | 'tracking';
type PollState = 'awaiting_gov' | 'analyzing' | 'redlines';

function TenderClient({ id }: { id: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  
  // Page states
  const [activeStep, setActiveStep] = useState<StepState>('pre-flight');
  const [switches, setSwitches] = useState({
    iso: false,
    financials: false,
    gst: false
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  // Polling states
  const [pollState, setPollState] = useState<PollState>('awaiting_gov');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [pollSeconds, setPollSeconds] = useState(0);

  // Pre-flight validation checker
  const isUploadUnlocked = switches.iso && switches.financials && switches.gst;

  // React-dropzone config (disabled state holds until switches are checked)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        showToast('File loaded. Ready for submission.', 'success');
      }
    },
    disabled: !isUploadUnlocked,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  // Submit to Government API POST (FormData Append)
  const handleSubmit = async () => {
    if (!file) {
      showToast('Please select a PDF file first.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create FormData and append PDF file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tender_id', id);
    
    try {
      showToast('Uploading compliance bundle to Government registry...', 'info');
      
      const response = await fetch('http://127.0.0.1:8000/api/v2/vendor/submit', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      showToast('Bundle submitted successfully. Initializing AI analysis.', 'success');
      localStorage.setItem('tender_status_crpf-2026', 'Awaiting Gov AI');
      setActiveStep('tracking');
    } catch (err: any) {
      console.warn("Backend submit failed: ", err.message);
      
      // Fallback Demo-Mode Activation
      setIsSimulationMode(true);
      showToast('Connection to backend failed. Running secure local simulation.', 'info');
      localStorage.setItem('tender_status_crpf-2026', 'Awaiting Gov AI');
      setActiveStep('tracking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tracking page Polling Simulation & API request loop
  useEffect(() => {
    if (activeStep !== 'tracking') return;

    // Reset polling states on transition
    setPollState('awaiting_gov');
    setPollSeconds(0);

    const interval = setInterval(async () => {
      setPollSeconds(prev => {
        const nextSec = prev + 3;
        
        // Phase 1: 0 - 3 seconds (Awaiting action)
        if (nextSec === 3) {
          setPollState('analyzing');
        }
        // Phase 2: 3 - 6 seconds (Analyzing)
        else if (nextSec === 6) {
          setPollState('redlines');
          localStorage.setItem('tender_status_crpf-2026', 'Action Required');
          showToast('AI Audit Complete: Compliance redlines generated.', 'error');
        }
        
        return nextSec;
      });

      // Execute actual API polling endpoint as requested
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v2/vendor/status/${id}`);
        if (res.ok) {
          const data = await res.json();
          // If the backend exists and returns a status, we override the local simulation
          if (data.status === 'complete' || data.status === 'redlines') {
            setPollState('redlines');
            localStorage.setItem('tender_status_crpf-2026', 'Action Required');
          } else if (data.status === 'processing') {
            setPollState('analyzing');
          }
        }
      } catch (e) {
        // Silently capture fetching errors - simulated state continues
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [activeStep, id, showToast]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex flex-col font-sans antialiased select-none">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-5%] right-[-5%] w-[250px] h-[250px] bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[250px] h-[250px] bg-rose-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95 text-slate-600"
          aria-label="Back to Hub"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">CRPF-T026</span>
          <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">CRPF Services 2026</span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Main Container - STRICTLY stacked vertically */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-6 flex flex-col gap-6 pb-28">
        
        <AnimatePresence mode="wait">
          {/* STEP 1 & 2: Pre-Flight Verification + Upload Flow */}
          {activeStep !== 'tracking' && (
            <motion.div
              key="upload-flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* Process Description */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Upload</h1>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Verify the pre-flight checklists to unlock the PDF upload zone. Files are scanned against standard GFR 2017 compliance logic-gates.
                </p>
              </div>

              {/* Step 1: Pre-Flight checklist */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <span className="w-5 h-5 bg-blue-50 text-blue-600 font-black text-xs rounded-full flex items-center justify-center">1</span>
                  <h2 className="text-sm font-bold text-slate-800">Pre-Flight Verification</h2>
                </div>

                {/* ISO 9001 Switch */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">ISO 9001 Certification</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Mandatory Attachment</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={switches.iso} 
                      onChange={(e) => setSwitches({...switches, iso: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Audited Financials Switch */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">3-Year Audited Financials</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Required For Clause 2.1</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={switches.financials} 
                      onChange={(e) => setSwitches({...switches, financials: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* GST Compliance Switch */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">GSTIN Registration Registry</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Required For Clause 2.3</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={switches.gst} 
                      onChange={(e) => setSwitches({...switches, gst: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Step 2: Upload Dropzone */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <span className="w-5 h-5 bg-blue-50 text-blue-600 font-black text-xs rounded-full flex items-center justify-center">2</span>
                  <h2 className="text-sm font-bold text-slate-800">Document Upload</h2>
                </div>

                {/* Drag-Drop Box */}
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    !isUploadUnlocked 
                      ? 'border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-50' 
                      : isDragActive 
                      ? 'border-blue-500 bg-blue-50/20' 
                      : 'border-slate-200 hover:border-blue-400 bg-white'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {!isUploadUnlocked ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Locked Zone</span>
                      <p className="text-[10px] px-4 font-semibold text-slate-400">Complete pre-flight verification to unlock file uploading.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Tap or Drag PDF</span>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Only compliance PDF accepted (Max 15MB)</p>
                    </div>
                  )}
                </div>

                {/* File Attachment Card */}
                {file && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{file.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-rose-500 transition-colors active:scale-95 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Submit Action Button */}
              <button 
                onClick={handleSubmit}
                disabled={!file || isSubmitting}
                className={`w-full h-13 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg ${
                  !file || isSubmitting 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Submit to Government
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 3: Live Tracking & Redline Inbox */}
          {activeStep === 'tracking' && (
            <motion.div
              key="tracking-flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 w-full"
            >
              
              {/* Dynamic status Header card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4">
                
                {/* Dynamic Polling Status Icon */}
                <AnimatePresence mode="wait">
                  {pollState === 'awaiting_gov' && (
                    <motion.div 
                      key="awaiting"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500"
                    >
                      <Clock className="w-6 h-6 animate-pulse" />
                    </motion.div>
                  )}

                  {pollState === 'analyzing' && (
                    <motion.div 
                      key="analyzing"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 relative"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full bg-amber-400/20"
                      />
                      <Sparkles className="w-6 h-6 relative" />
                    </motion.div>
                  )}

                  {pollState === 'redlines' && (
                    <motion.div 
                      key="redlines"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600"
                    >
                      <AlertTriangle className="w-6 h-6 animate-bounce" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status text */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {pollState === 'awaiting_gov' && "Awaiting Government Action"}
                    {pollState === 'analyzing' && "Gov AI Analyzing..."}
                    {pollState === 'redlines' && "Action Required — Redlines"}
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {pollState === 'awaiting_gov' && "Your GFR compliance package is queued in the National Secure Registry."}
                    {pollState === 'analyzing' && "Executing statutory GFR 2017 logic-gates and financial audits."}
                    {pollState === 'redlines' && "The government audit engine detected 3 compliance gaps in your submission."}
                  </p>
                </div>

                {/* Dynamic micro message */}
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 border border-slate-100 rounded-md">
                  {pollState === 'awaiting_gov' && "Queue: #1 in line"}
                  {pollState === 'analyzing' && "Parsing Income sheets..."}
                  {pollState === 'redlines' && "Audit Completed"}
                </div>
              </div>

              {/* Redline Inbox Accordion List (State 3 Only) */}
              <AnimatePresence>
                {pollState === 'redlines' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">AI compliance feedback</span>
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 animate-pulse">3 Gaps Detected</span>
                    </div>

                    {/* Redline List */}
                    <div className="flex flex-col gap-3 w-full">
                      {REDLINES.map((item) => {
                        const isOpen = activeAccordion === item.id;
                        return (
                          <div 
                            key={item.id} 
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                          >
                            {/* Accordion header click trigger */}
                            <button
                              onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                              className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
                            >
                              <div className="flex items-start gap-3 min-w-0 pr-2">
                                <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                                  <AlertTriangle className="w-3 h-3" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 leading-snug truncate max-w-[240px]">
                                  {item.risk}
                                </span>
                              </div>
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                            </button>

                            {/* Accordion Content wrapper */}
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden border-t border-slate-50 bg-slate-50/20"
                                >
                                  <div className="p-4 flex flex-col gap-3 text-xs leading-relaxed font-medium text-slate-600">
                                    <p>{item.explanation}</p>
                                    
                                    {/* Safe Harbor Redline Box */}
                                    <div className="bg-[#fef9c3]/60 border border-[#fef08a] p-3.5 rounded-2xl flex flex-col gap-1.5 text-slate-700">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Safe-Harbor Compliance Redline
                                      </span>
                                      <p className="font-mono text-[10px] text-slate-600 bg-white/50 p-2 rounded-xl border border-yellow-200/50 leading-relaxed select-text">
                                        "{item.redlineText}"
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    {/* Return Action */}
                    <button 
                      onClick={() => router.push('/')}
                      className="w-full h-12 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all hover:bg-slate-50 mt-4 shadow-sm"
                    >
                      Back to Dashboard
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center py-6 mt-auto border-t border-slate-100/60 bg-white/40">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">
          National Procurement System <br />
          Standard GFR Compliance v2026.
        </p>
      </footer>
    </div>
  );
}
