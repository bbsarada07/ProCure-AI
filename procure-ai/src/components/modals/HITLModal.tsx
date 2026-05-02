'use client';

import { useState } from 'react';

import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye,
  FileText,
  MessageSquare,
  History,
  ShieldCheck,
  Image as ImageIcon,
  Link2,
  Copy,
  Clock,
  Info,
  ShieldAlert
} from 'lucide-react';

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";


export interface HITLModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidderName: string;
  criterion: {
    description: string;
    requirement: string;
    status: string;
    compiledValue?: string;
    defensibilityScore?: number;
  };
  isFraud?: boolean;
}

export function HITLModal({ isOpen, onClose, bidderName, criterion, isFraud }: HITLModalProps) {
  const [showResubmissionLink, setShowResubmissionLink] = useState(false);
  const [isDocumentBlurred, setIsDocumentBlurred] = useState(criterion.status === 'Needs Review');
  const isNeedsReview = criterion.status === 'Needs Review';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden bg-slate-50 border-none">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-blue-400 border-blue-400/30 uppercase tracking-widest text-[10px]">Evaluation Detail</Badge>
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-sm font-medium text-slate-400">{bidderName}</span>
              </div>
              <DialogTitle className="text-2xl font-bold">{criterion.description}</DialogTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                criterion.status === 'Pass' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                criterion.status === 'Fail' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                'bg-amber-500/10 border-amber-500/30 text-amber-500'
              }`}>
                {criterion.status === 'Pass' && <CheckCircle2 className="w-4 h-4" />}
                {criterion.status === 'Fail' && <XCircle className="w-4 h-4" />}
                {criterion.status === 'Needs Review' && <AlertCircle className="w-4 h-4" />}
                <span className="text-sm font-bold uppercase tracking-wider">{criterion.status}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: AI Reasoning & Triage */}
            <div className="w-2/5 flex flex-col border-r bg-white">
              <ScrollArea className="flex-1 p-6">
                <section className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Requirement</h3>
                    <p className="text-sm text-slate-900 border-l-2 border-blue-500 pl-3 leading-relaxed">
                      {criterion.requirement}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${isFraud ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isFraud ? 'text-rose-400' : 'text-slate-400'}`}>
                      {isFraud ? 'Collusion Topology Execution' : 'Logic-Gate Audit'}
                    </h3>
                    <div className="flex items-start gap-3">
                      <div className={`${isFraud ? 'bg-rose-600' : 'bg-slate-900'} p-1.5 rounded-lg`}>
                        <ShieldAlert className="w-4 h-4 text-white" />
                      </div>
                      <div className="space-y-3">
                        <p className={`text-sm leading-relaxed ${isFraud ? 'text-rose-900 font-bold' : 'text-slate-700'}`}>
                          {isFraud 
                            ? "Cross-Document Topology Mismatch: The PAN (Permanent Account Number) verified from the Tax Return document does not match the PAN listed on the ISO Certificate. Potential network collusion or mixed submission."
                            : isNeedsReview 
                              ? "Document defensibility score below threshold (42%). Could not reliably execute logic-gates on numerical turnover figures due to motion blur and low contrast in the scanned image."
                              : `Compiled Value: ${criterion.compiledValue} matches or exceeds the required threshold. GFR Defensibility Score: ${Math.round((criterion.defensibilityScore || 0) * 100)}%.`}
                        </p>
                        <div className={`flex items-center gap-4 text-[11px] font-mono ${isFraud ? 'text-rose-400' : 'text-slate-500'}`}>
                          <span>Engine: GFR Defensibility Engine</span>
                          <span>Audit ID: {isFraud ? 'CLD-9902' : 'TR-102'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Statutory GFR Triage</h3>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 gap-2 shadow-sm font-semibold"
                        onClick={onClose}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Criteria
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-10 gap-2 font-bold shadow-sm"
                        onClick={onClose}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Criteria
                      </Button>
                      <Button 
                        variant="ghost" 
                        className={`w-full h-10 gap-2 transition-all ${showResubmissionLink ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
                        onClick={() => setShowResubmissionLink(true)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Request Zero-Trust Resubmission
                      </Button>

                      {showResubmissionLink && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 animate-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-blue-900 uppercase">Secure Upload Link</span>
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                              <Clock className="w-3 h-3" />
                              Expires in 24h
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 h-8 bg-white border border-blue-200 rounded px-2 flex items-center text-[11px] font-mono text-blue-700 truncate">
                              procure.gov.in/upload/req-xyz-4491
                            </div>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-100"
                              onClick={() => {
                                navigator.clipboard.writeText('procure.gov.in/upload/req-xyz-4491');
                                const btn = document.activeElement as HTMLButtonElement;
                                if (btn) {
                                  const originalContent = btn.innerHTML;
                                  btn.innerHTML = '<span class="text-[8px] font-bold">COPIED</span>';
                                  setTimeout(() => btn.innerHTML = originalContent, 2000);
                                }
                              }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </ScrollArea>
              
              <div className="p-4 border-t bg-slate-50">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Audit Statutory Ledger</h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <History className="w-3 h-3" />
                  <span>Logic-gate flagged item at 2026-04-19 10:20 AM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Source Evidence */}
            <div className="flex-1 bg-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Badge className="bg-slate-900/80 backdrop-blur text-[10px] uppercase font-bold tracking-tight">Source Viewport</Badge>
                
                {/* Feature 1: Bharat Edge-Case Indicators in Modal */}
                <Badge className="bg-emerald-500 text-white text-[10px] font-bold gap-1.5 border-none shadow-lg">
                  <CheckCircle2 className="w-3 h-3" />
                  Valid Physical Stamp Detected
                </Badge>
                <Badge className="bg-blue-500 text-white text-[10px] font-bold gap-1.5 border-none shadow-lg">
                  <Info className="w-3 h-3" />
                  Kannada Text {"->"} Auto-Translated to English
                </Badge>
              </div>

              {/* Mock Document Snippet */}
              <div className={`w-full max-w-xl aspect-[3/4] bg-white shadow-inner rounded-sm border-2 border-dashed border-slate-300 overflow-hidden flex flex-col ${isNeedsReview ? 'grayscale contrast-125' : ''}`}>
                <div className="bg-slate-100 h-10 flex items-center px-4 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                </div>
                <div className="flex-1 p-8 text-slate-300 relative">
                  {/* Mock content text lines */}
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 w-3/4 rounded" />
                    <div className="h-4 bg-slate-100 w-full rounded" />
                    <div className="h-4 bg-slate-100 w-5/6 rounded" />
                    <div className="h-10 bg-slate-50 w-full rounded flex items-center px-3 border border-slate-100">
                      <div className="h-4 bg-slate-200 w-1/3 rounded" />
                    </div>
                    {/* The "Found" data section */}
                    <div className="relative group pt-4">
                      <div className="h-12 border-2 border-dashed border-amber-400/60 rounded bg-amber-400/20 flex items-center justify-center">
                        {isDocumentBlurred ? (
                          <div className="blur-sm select-none text-slate-900 font-bold text-xl tracking-tighter">
                            TOTAL TURNOVER: 5,12,00,000
                          </div>
                        ) : (
                          <div className="text-slate-900 font-bold text-xl">
                            TOTAL TURNOVER: 6,20,00,000
                          </div>
                        )}
                        <div className="absolute -top-2.5 right-2 bg-amber-400 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          DNA Verified Area
                        </div>
                      </div>
                    </div>
                    <div className="h-4 bg-slate-100 w-2/3 rounded" />
                    <div className="h-4 bg-slate-100 w-full rounded" />
                  </div>

                  {isDocumentBlurred && (
                    <div className="absolute inset-0 bg-slate-300/30 backdrop-blur-[4px] flex items-center justify-center z-20">
                      <div className="bg-white/90 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 max-w-[240px] text-center border border-amber-200">
                        <div className="p-3 bg-amber-100 rounded-full">
                          <ImageIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            Low Legibility Detected
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Logic-gates could not verify this area with high defensibility.
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-slate-900 text-white hover:bg-slate-800 text-[10px] h-8"
                          onClick={() => setIsDocumentBlurred(false)}
                        >
                          Reveal Document
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View Controls */}
              <div className="mt-8 flex gap-3">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white shadow-sm h-8 px-4 gap-2 text-xs font-bold text-slate-600"
                  onClick={() => setIsDocumentBlurred(!isDocumentBlurred)}
                >
                  <Eye className="w-3.5 h-3.5" /> {isDocumentBlurred ? 'Reveal' : 'Blur'} Document
                </Button>
                <Button size="sm" variant="secondary" className="bg-white shadow-sm h-8 px-4 gap-2 text-xs font-bold text-slate-600">
                  <FileText className="w-3.5 h-3.5" /> Full Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
