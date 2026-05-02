'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UploadCloud, 
  FileWarning, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import { useState, useRef } from 'react';

export default function DraftAnalyzerPage() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setIsAnalyzed(false);

    // Simulate AI Vetting Process
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzed(true);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pre-Flight Draft Analyzer</h2>
          <p className="text-slate-500 mt-1">AI-powered vetting of tender documents for restrictive clauses and compliance risks.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-xs font-bold uppercase tracking-wider">Analysis Engine: v2.4</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Drag & Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".pdf,.docx,.csv"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 transition-all text-center min-h-[300px]">
              {isUploading ? (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-10 h-10 text-blue-600 animate-spin-slow" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">AI Vetting in Progress...</h3>
                    <p className="text-sm text-slate-500 italic">Analyzing {fileName} for restrictive clauses...</p>
                  </div>
                  <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-progress" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {fileName ? `Uploaded: ${fileName}` : 'Upload Draft Tender for AI Analysis'}
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    {fileName ? 'Click again to replace the document for analysis.' : 'Drag and drop your .docx, .pdf or .csv tender draft to check for risks.'}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span>Supports: PDF, DOCX, CSV</span>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Max size: 25MB</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {isAnalyzed && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Analysis Results</h3>
              </div>

              <Card className="border-amber-200 bg-amber-50/30 overflow-hidden">
                <div className="flex">
                  <div className="w-1.5 bg-amber-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 p-3 rounded-xl shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 uppercase text-[10px] font-bold">Critical Risk</Badge>
                            <span className="text-sm font-bold text-amber-900">Restrictive Clause Detected</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            You requested an <span className="font-bold text-slate-900 underline decoration-amber-500/50">ISO 27001 certification</span> but only provided a <span className="font-bold text-slate-900 underline decoration-amber-500/50">3-day submission window</span>. 
                          </p>
                        </div>
                        
                        <div className="p-4 bg-white/50 rounded-lg border border-amber-200/50">
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-2">Legal Impact</h4>
                          <p className="text-sm text-slate-600">
                            This practically limits bids to pre-existing vendors and risks a failed tender due to perceived bias. This may violate the General Financial Rules (GFR) Section 144.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-100/50 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Recommendation: Extend submission window to 14 days.
                          </div>
                          <Button size="sm" variant="ghost" className="text-blue-600 font-bold gap-1 hover:text-blue-700 hover:bg-blue-50">
                            Auto-Fix Draft <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/30 overflow-hidden">
                <div className="flex">
                  <div className="w-1.5 bg-emerald-500" />
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 uppercase text-[10px] font-bold">Compliance OK</Badge>
                        <span className="text-sm font-bold text-emerald-900">GST and MSME Preferences Correctly Applied</span>
                      </div>
                      <p className="text-sm text-slate-600">All statutory preferences for MSMEs and Make-in-India (MII) are consistent with current Ministry of Finance guidelines.</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Analyzer Stats</CardTitle>
              <CardDescription className="text-slate-400">Current vetting session metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase font-bold tracking-widest text-slate-500">
                  <span>Compliance Score</span>
                  <span>72%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[72%]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Clauses Checked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">1</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Risks Found</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest">AI Tip</h4>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Tenders with a minimum window of 14 days receive an average of 4.2x more bids than those with 3-day windows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
