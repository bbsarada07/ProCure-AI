'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  FileText,
  UploadCloud,
  FileCheck,
  Loader2,
  Plus
} from 'lucide-react';
import { useState, useRef } from 'react';
import { compileTenderDNA } from '@/lib/api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { t } = useAppContext();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'total_bidders', value: '10', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'cleared', value: '7', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'rejected', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await compileTenderDNA(file);
      setExtractedData(result);
    } catch (error) {
      console.error('Extraction error:', error);
      showToast('Failed to process tender. Check backend connection.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('program_dashboard')}</h2>
          <p className="text-slate-500 mt-1">{t('overview_description')}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/analytics">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('analytics')}
            </Button>
          </Link>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger 
              nativeButton={true}
              render={
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-500/20">
                  <Plus className="w-4 h-4" />
                  {t('new_tender')}
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[550px] bg-white border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">Initialize Tender DNA Compiler</DialogTitle>
                <DialogDescription className="text-slate-500">
                  Upload the official tender document (PDF/DOCX) to begin AI-powered DNA compilation.
                </DialogDescription>
              </DialogHeader>

              {!extractedData ? (
                <div className="space-y-6 py-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative cursor-pointer"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                    />
                    <div className="flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {file ? file.name : 'Click to select DNA source'}
                      </h4>
                      <p className="text-xs text-slate-500">Supports PDF and Word documents up to 50MB</p>
                    </div>
                  </div>
                  
                  <DialogFooter className="sm:justify-between items-center gap-4">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">AI Engine: Gemini 2.0 Flash</p>
                    <Button 
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className="bg-blue-600 hover:bg-blue-700 min-w-[140px]"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Compiling DNA...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 mr-2" />
                          Start DNA Compilation
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                    <div className="bg-emerald-500 p-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">DNA Compilation Complete</p>
                      <p className="text-xs text-emerald-700">Logic-gates have compiled multidimensional DNA from the document.</p>
                    </div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <pre className="text-[10px] font-mono text-slate-700 whitespace-pre-wrap">
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
                  </div>

                  <DialogFooter>
                    <Link href="/tender/crpf-2026/criteria" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Immutable Ledger
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{t(stat.label)}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('active_tenders')}</CardTitle>
              <CardDescription>{t('active_tenders_desc')}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
              {1} {t('active')}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 line-clamp-1">CRPF Construction Services 2026</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>ID: CRPF-CS-2026-004</span>
                      <span>•</span>
                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">60% Complete</p>
                    <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500 w-[60%]" />
                    </div>
                  </div>
                  <Link href="/tender/crpf-2026/evaluation">
                    <Button size="sm" variant="ghost" className="rounded-full group-hover:bg-blue-50 group-hover:text-blue-600">
                      {t('view')} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{t('statutory_agent')}</CardTitle>
            <CardDescription className="text-slate-400">{t('powered_by_gfr')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('agent_summary')}
            </p>
            <div className="space-y-3">
              <Link href="/tender/crpf-2026/evaluation">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none gap-2">
                  <FileText className="w-4 h-4" />
                  View Evaluation Matrix
                </Button>
              </Link>
              <Link href="/tender/crpf-2026/evaluation">
                <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5">
                  {t('gen_audit_report')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { ShieldCheck } from 'lucide-react';
