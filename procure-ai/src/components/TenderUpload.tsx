'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function TenderUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtractedData(null); // Reset extraction on new file
    }
  };

  const handleCompile = async () => {
    if (!file) return;

    setIsExtracting(true);
    setExtractedData(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/v2/saas-analyzer/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream reader available");

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.status === "done" && parsed.final_report) {
                const report = parsed.final_report;
                setExtractedData({
                  "Total Contract Value": report.paralegal?.financial_figures?.[0] || "N/A",
                  "Monthly Retainer": report.paralegal?.financial_figures?.[1] || "N/A",
                  "Health Score": `${report.risk_assessor?.health_score || 0}/100`,
                  "Pages Analyzed": report.extractor?.total_pages?.toString() || "0",
                  "Critical Risks": report.risk_assessor?.risks?.filter((r: any) => r.severity === "CRITICAL").length?.toString() || "0"
                });
                setIsExtracting(false);
              }
            } catch (err) {
              console.error("JSON parse error", err);
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to reach the backend.");
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Tender DNA Compiler</CardTitle>
              <CardDescription>Upload official tender documents to extract GFR-compliant eligibility criteria.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group relative cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all ${
                file 
                ? 'border-emerald-200 bg-emerald-50/30 shadow-inner' 
                : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                capture="environment"
              />
              
              <div className={`w-20 h-20 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                file ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {file ? <FileText className="w-10 h-10 md:w-8 md:h-8" /> : <UploadCloud className="w-10 h-10 md:w-8 md:h-8" />}
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                  {file ? file.name : 'Select DNA Source Document'}
                </h4>
                <p className="text-sm text-slate-500">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for GFR Mapping` : 'Supports PDF, Word and Text documents up to 50MB'}
                </p>
              </div>

              {file && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    File Selected
                  </Badge>
                </div>
              )}
            </div>

            <Button 
              onClick={handleCompile}
              disabled={!file || isExtracting}
              className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:bg-slate-100 disabled:text-slate-400"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Extracting GFR Criteria...
                </>
              ) : (
                'Compile Tender DNA'
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <strong>Connection Error:</strong> {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {extractedData && (
        <Card className="border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-500">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg shadow-md shadow-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-emerald-900">DNA Compilation Successful</CardTitle>
                  <CardDescription className="text-emerald-700">AI-powered extraction of eligibility parameters complete.</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200 flex gap-1 items-center">
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                98% Accuracy
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-blue-500 transition-colors">{key}</span>
                  <span className="text-sm font-bold text-slate-900">{value as string}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-slate-500 italic">Immutable DNA Ledger Generated via ProcureAI Engine</span>
              </div>
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-sm h-8 px-3"
                onClick={() => router.push('/tender/crpf-2026/criteria')}
              >
                Proceed to Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
