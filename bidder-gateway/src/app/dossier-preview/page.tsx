'use client';

import React, { useRef, useState } from 'react';
import { Shield, CheckCircle2, ArrowLeft, Printer, Share2, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../context/ToastContext';

export default function DossierPreview() {
  const { showToast } = useToast();
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Official Decision Dossier',
          text: 'View the finalized evaluation dossier for BSF-T012.',
          url: typeof window !== 'undefined' ? window.location.href : '',
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
      showToast('Link Copied to Clipboard!', 'success');
    }
  };

  const handleExportPDF = async () => {
    if (!documentRef.current) return;
    
    setIsExporting(true);
    
    try {
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      if (!html2pdf) throw new Error('Library failed to load');

      const element = documentRef.current;
      const opt = {
        margin: 0,
        filename: 'Official_Decision_Dossier.pdf',
        image: { type: 'jpeg' as const, quality: 1.0 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc: Document) => {
            // Remove all external stylesheets that might contain oklch/lab
            const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
            styles.forEach(s => s.remove());

            // Injected a hyper-safe CSS baseline
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              * { box-sizing: border-box !important; }
              body { background: #ffffff !important; }
              .flex { display: flex !important; }
              .flex-col { flex-direction: column !important; }
              .items-center { align-items: center !important; }
              .justify-between { justify-content: space-between !important; }
              .text-center { text-align: center !important; }
              .uppercase { text-transform: uppercase !important; }
              .font-bold { font-weight: bold !important; }
              .font-black { font-weight: 900 !important; }
              .w-full { width: 100% !important; }
              .grid { display: grid !important; }
              .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr !important; }
              .gap-6 { gap: 1.5rem !important; }
              .space-y-1 > * + * { margin-top: 4px !important; }
              .space-y-4 > * + * { margin-top: 16px !important; }
              .space-y-6 > * + * { margin-top: 24px !important; }
              .space-y-8 > * + * { margin-top: 32px !important; }
              .space-y-10 > * + * { margin-top: 40px !important; }
              .pt-10 { padding-top: 40px !important; }
              .pt-20 { padding-top: 80px !important; }
              .mt-auto { margin-top: auto !important; }
              .border-b-2 { border-bottom: 2px solid #000 !important; }
              .border-t { border-top: 1px solid #eee !important; }
              .border-l-4 { border-left: 4px solid #000 !important; }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      showToast('Dossier Downloaded', 'success');
    } catch (err) {
      console.error('Export failed, using print fallback:', err);
      // Fallback: Trigger print dialog which allows "Save as PDF"
      handlePrint();
      showToast('Using Print Fallback...', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 flex flex-col items-center print:bg-white print:p-0 print:block">
      {/* Top Action Bar */}
      <div className="w-full max-w-[210mm] flex items-center justify-between mb-8 print:hidden">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-white/60 hover:text-white font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition-all"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* A4 Document Wrapper */}
      <div 
        ref={documentRef}
        className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] p-[20mm] flex flex-col font-serif relative overflow-hidden print:shadow-none print:m-0"
        style={{ color: '#1e293b' }} // slate-800
      >
        {/* Subtle Background Seal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <Shield className="w-[120mm] h-[120mm]" />
        </div>

        {/* Official Header */}
        <div className="flex flex-col items-center text-center border-b-2 border-slate-900 pb-10 mb-12">
          <div className="w-16 h-16 bg-[#0f172a] rounded-2xl flex items-center justify-center mb-4 text-white">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#0f172a' }}>Government of India</h1>
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Ministry of Infrastructure & Digital Procurement</p>
          <div className="mt-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' }}>
            Statutory AI Audit Certificate
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase" style={{ color: '#94a3b8' }}>Reference Number</p>
              <p className="font-bold text-sm" style={{ color: '#0f172a' }}>GA-BSF-2026-T012-AUDIT-FINAL</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black uppercase" style={{ color: '#94a3b8' }}>Date of Issue</p>
              <p className="font-bold text-sm" style={{ color: '#0f172a' }}>02 May 2026</p>
            </div>
          </div>

          <div className="space-y-4 pt-10">
            <h2 className="text-xl font-bold border-l-4 border-[#0f172a] pl-4 uppercase tracking-tight" style={{ color: '#0f172a' }}>Official Verification Result</h2>
            <p className="text-base leading-relaxed italic" style={{ color: '#475569' }}>
              "This document serves as formal notification that the tender submission provided by <span className="font-bold" style={{ color: '#0f172a' }}>Falcon Constructions Pvt. Ltd.</span> for the project <span className="font-bold" style={{ color: '#0f172a' }}>Surveillance Tower IT Infrastructure (BSF-T012)</span> has undergone an Immutable AI-driven Multi-Dimensional Audit."
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6">
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
              <p className="text-[10px] font-black uppercase mb-2" style={{ color: '#94a3b8' }}>Technical Score</p>
              <p className="text-xl font-black" style={{ color: '#0f172a' }}>100/100</p>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
              <p className="text-[10px] font-black uppercase mb-2" style={{ color: '#94a3b8' }}>Financial Match</p>
              <p className="text-xl font-black" style={{ color: '#10b981' }}>VERIFIED</p>
            </div>
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
              <p className="text-[10px] font-black uppercase mb-2" style={{ color: '#94a3b8' }}>Compliance Rating</p>
              <p className="text-xl font-black" style={{ color: '#0f172a' }}>AAAA+</p>
            </div>
          </div>

          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-4" style={{ color: '#10b981' }}>
              <CheckCircle2 className="w-8 h-8" />
              <h3 className="text-2xl font-black uppercase tracking-tight">Final Verdict: Awarded</h3>
            </div>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#64748b' }}>
              Based on the extracted dossier metadata and GFR compliance vectors, the AI engine has authorized the progression of this bid to the primary award ledger. No further manual verification is required for this phase.
            </p>
          </div>
        </div>

        {/* Footer / Signature Block */}
        <div className="pt-20 mt-auto border-t flex justify-between items-end" style={{ borderColor: '#f1f5f9' }}>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Digital Audit Hash</p>
              <p className="text-[10px] font-mono font-bold px-2 py-1 rounded" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>8812-4A2B-F9A2-0D1E-X921</p>
            </div>
            <div className="w-32 h-32">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://procure-ai.gov.in/verify/8812-4A2B-F9A2-0D1E" 
                alt="Verification QR"
                className="w-full h-full grayscale"
              />
            </div>
          </div>
          <div className="text-right space-y-6">
            <div className="space-y-1">
              <div className="h-12 w-48 border-b border-[#0f172a] ml-auto mb-2 flex items-center justify-center">
                <span className="font-cursive text-xl select-none italic" style={{ color: '#94a3b8' }}>Signed Electronically</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Director of Digital Procurement</p>
              <p className="text-xs font-bold" style={{ color: '#0f172a' }}>New Delhi HQ, Statutory Authority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
