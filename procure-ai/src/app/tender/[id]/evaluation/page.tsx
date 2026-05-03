'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Filter, 
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles, 
  Info, 
  ShieldAlert, 
  Link2, 
  Copy, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  FileCheck, 
  FileWarning,
  Mail, 
  Printer, 
  ShieldX,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { MOCK_BIDDERS, MOCK_DNA_COMPILATION } from '@/lib/mockData';
import { HITLModal } from '@/components/modals/HITLModal';
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAppContext } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { BidderCompareModal } from '@/components/modals/BidderCompareModal';
import { Scale, Terminal } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import fallbackData from '@/lib/mockEvaluationData.json';
import { LiveAuditStream } from '@/components/LiveAuditStream';

const FinancialSparkline = ({ value, category }: { value: string, category: string }) => {
  if (category !== 'Financial') return null;
  
  // Extract number from ₹6.2 Crore
  const num = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  
  // Mock trend logic for visual demonstration
  // If value is higher, show generally upward. If below 5, show downward trend.
  const isTargetMet = num >= 5;
  const data = isTargetMet ? [
    { v: num * 0.7 },
    { v: num * 0.85 },
    { v: num }
  ] : [
    { v: num * 1.3 },
    { v: num * 1.15 },
    { v: num }
  ];

  const isUpward = data[2].v >= data[0].v;
  const strokeColor = isUpward ? '#10b981' : '#f43f5e'; // Emerald-500 vs Rose-500

  return (
    <div className="h-5 w-16 mt-1 opacity-80 min-h-[20px] min-w-[64px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="v" 
            stroke={strokeColor} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function EvaluationMatrixPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBidder, setSelectedBidder] = useState<any>(null);
  const [selectedCriterion, setSelectedCriterion] = useState<any>(null);
  const [isPrecedentOpen, setIsPrecedentOpen] = useState(false);
  const [precedentSearch, setPrecedentSearch] = useState('');
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionBidder, setRejectionBidder] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [precedentResult, setPrecedentResult] = useState<any>(null);
  const [selectedBiddersForCompare, setSelectedBiddersForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isLiveEvaluating, setIsLiveEvaluating] = useState(false);
  const [liveJobId, setLiveJobId] = useState<string | null>(null);
  const [evaluationLogs, setEvaluationLogs] = useState<string[]>([]);
  const { role, t, language } = useAppContext();
  const [showFallbackToast, setShowFallbackToast] = useState(false);

  const [showApexLive, setShowApexLive] = useState(false);
  const [apexStatus, setApexStatus] = useState<'processing' | 'verified'>('processing');

  useEffect(() => {
    const checkStatus = () => {
      const status = localStorage.getItem('demo_tender_status');
      if (status === 'submitted') {
        setShowApexLive(true);
        const timer = setTimeout(() => {
          setApexStatus('verified');
        }, 3000);
        return () => clearTimeout(timer);
      }
    };
    
    checkStatus();
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  const filteredBidders = MOCK_BIDDERS.filter(bidder => {
    const matchesSearch = bidder.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bidder.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(bidder.overallStatus);
    return matchesSearch && matchesStatus;
  });

  const openModal = (bidder: any, criterion: any) => {
    setSelectedBidder(bidder);
    setSelectedCriterion(criterion);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pass':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">{t('pass')}</Badge>;
      case 'Fail':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">{t('fail')}</Badge>;
      case 'Needs Review':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">{t('review')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCritLabel = (id: string, fallback: string) => {
    const keyMap: any = {
      'crit_1': 'crit_turnover',
      'crit_2': 'crit_projects',
      'crit_3': 'crit_gst',
      'crit_4': 'crit_iso'
    };
    return t(keyMap[id] || fallback);
  };

  const translateValue = (val: string | undefined) => {
    if (!val || language === 'EN') return val;
    let translated = val;
    translated = translated.replace(/Crore/g, 'करोड़');
    translated = translated.replace(/Verified/g, 'सत्यापित');
    translated = translated.replace(/Projects/g, 'परियोजनाएं');
    translated = translated.replace(/Not Clearly Legible/g, 'स्पष्ट रूप से पठनीय नहीं');
    translated = translated.replace(/Expired/g, 'समय सीमा समाप्त');
    translated = translated.replace(/STAMP OK/g, 'स्टाम्प ठीक है');
    return translated;
  };

  const handleAnalyze = () => {
    if (!precedentSearch) return;
    setIsAnalyzing(true);
    setIsPrecedentOpen(false);
    
    // Select relevant response based on keywords
    const responses = [
      {
        title: "Statutory GFR Precedent: ISO Certificate Disputes",
        text: "In the 2024 Border Fencing tender, blurry ISO certificates were resolved via the Zero-Trust Resubmission Tunnel within 12 hours.",
        action: "Recommended Action: Request Resubmission via Statutory GFR Triage."
      },
      {
        title: "Statutory GFR Precedent: Turnover Shortfalls",
        text: "In the 'Bridge Construction 2023' project, a bidder with 95% of required turnover was conditionally passed after submitting a Parent Company Guarantee.",
        action: "Recommended Action: Review for Financial Guarantee."
      },
      {
        title: "Statutory GFR Precedent: Conflict of Interest",
        text: "Past rulings in the Northern Sector tenders indicate that sibling-owned subsidiaries must be flagged for manually auditing to prevent network collusion.",
        action: "Recommended Action: Trigger Collusion Topology Analysis."
      }
    ];

    const keyword = precedentSearch.toLowerCase();
    let result = responses[0];
    if (keyword.includes('turnover') || keyword.includes('money') || keyword.includes('finance')) result = responses[1];
    if (keyword.includes('fraud') || keyword.includes('conflict') || keyword.includes('rule')) result = responses[2];

    setTimeout(() => {
      setIsAnalyzing(false);
      setPrecedentResult(result);
      setIsPrecedentOpen(true);
    }, 1500);
  };

  const triggerExport = () => {
    setIsExporting(true);
    const reportContent = `
PROCURE-AI BIDDER EVALUATION MATRIX REPORT
------------------------------------------
Tender: CRPF Construction Services 2026
Generated: ${new Date().toLocaleString()}

BIDDER SUMMARY:
${MOCK_BIDDERS.map(b => `- ${b.name}: ${b.overallStatus}`).join('\n')}

DETAILED CRITERIA LOG:
${MOCK_BIDDERS.map(b => `
[${b.name}]
${Object.entries(b.criteria).map(([id, data]: any) => `  - Criterion ${id}: ${data.status}`).join('\n')}`).join('\n')}

------------------------------------------
OFFICIAL TENDER RECORD - GOVERNMENT OF INDIA
    `;
    setTimeout(() => {
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bidder_Evaluation_CRPF_2026.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1000);
  };

  const startLiveEvaluation = async (bidderName: string) => {
    try {
      const formData = new FormData();
      formData.append('bidder_name', bidderName);
      formData.append('tender_id', 'TENDER_8812');
      formData.append('language', language); // Feature 1: Send language to backend
      const dummyFile = new File(["dummy"], "bidder_docs.pdf", { type: "application/pdf" });
      formData.append('bidder_documents', dummyFile);

      // Feature 2: Robust try/catch with timeout for Graceful Degradation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced to 3s for snappier demo fallback

      const response = await fetch('http://localhost:8000/api/v1/evaluate-bidder', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      const jobId = data.job_id;
      setLiveJobId(jobId);
      const ws = new WebSocket(`ws://localhost:8000/ws/evaluation/${jobId}`);
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'EVALUATION_UPDATE') {
          setEvaluationLogs(prev => [`[LIVE] ${message.criterion}: ${message.status} - ${message.extracted_value || 'Verified'}`, ...prev]);
        } else if (message.type === 'JOB_COMPLETED') {
          setIsLiveEvaluating(false);
          ws.close();
        }
      };
      ws.onerror = () => triggerFallback();
      ws.onclose = () => setIsLiveEvaluating(false);
    } catch (error) {
      // Treated as an intentional Statutory Cache Trigger for demo/offline resilience
      console.log("[SYSTEM] Live DNA Pipeline unreachable. Triggering GFR-Compliant Secure Cache fallback...");
      triggerFallback();
    }
  };

  const triggerFallback = () => {
    setShowFallbackToast(true);
    setIsLiveEvaluating(true);
    setLiveJobId("SECURE_CACHE_001");
    setEvaluationLogs(["[SYSTEM] Connection lost. Securing data stream...", "[SYSTEM] API Rate Limit Reached.", "[SYSTEM] Switching to Local Secure Cache..."]);
    
    // Simulate live-feeling stream from fallback data
    let i = 0;
    const interval = setInterval(() => {
      const bidder = fallbackData.bidders[0];
      if (i < bidder.evaluations.length) {
        const evalItem = bidder.evaluations[i];
        setEvaluationLogs(prev => [`[CACHE] ${evalItem.criterion}: ${evalItem.status} - ${evalItem.extracted_value}`, ...prev]);
        i++;
      } else {
        setEvaluationLogs(prev => [`[SUCCESS] All data synchronized from local cache.`, ...prev]);
        setIsLiveEvaluating(false);
        clearInterval(interval);
      }
    }, 1500);

    setTimeout(() => setShowFallbackToast(false), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <span>{t('tenders')}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900">CRPF Construction Services 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-tight">{t('bidder_intelligence_matrix')}</h2>
            {role === 'Director' && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase text-[10px] font-black tracking-widest px-2">{t('zero_trust_mode')}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={cn(
              "gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all",
              selectedBiddersForCompare.length > 0 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}
            onClick={() => setIsCompareModalOpen(true)}
          >
            <Scale className="w-4 h-4" />
            {t('compare_selected')} ({selectedBiddersForCompare.length})
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={triggerExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {t('export_results')}
          </Button>
          <Button 
            className="bg-slate-900 hover:bg-slate-800 gap-2 px-6 text-white font-bold"
            onClick={() => setIsConfirming(true)}
          >
            {role === 'Director' ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                {t('sign_and_lock')}
              </>
            ) : (
              t('confirm_selection')
            )}
          </Button>
        </div>
      </div>

      {role === 'Director' && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">{t('checker_ledger')}</p>
              <p className="text-xs text-emerald-700">{t('checker_mode_active')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-white rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-700 uppercase tracking-tight">
              4 {t('passes_verified')}
            </div>
          </div>
        </div>
      )}

      {/* Live AI Audit Stream */}
      <LiveAuditStream />
      
      {/* Feature 4: Precedent Search (RAG) UI */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/5 rounded-xl blur-xl group-focus-within:bg-blue-500/10 transition-all duration-500" />
          <div className="relative flex gap-3 p-1 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
            <div className="flex items-center pl-4">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <Input 
              placeholder={t('ask_ai_placeholder')} 
              className="border-none shadow-none focus-visible:ring-0 h-12 text-base placeholder:text-slate-400 bg-transparent"
              value={precedentSearch}
              onChange={(e) => setPrecedentSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button 
              className="bg-slate-900 hover:bg-slate-800 h-12 px-6 rounded-lg font-bold min-w-[180px] text-white"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !precedentSearch}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin mr-2" />
                  {t('thinking')}
                </>
              ) : (
                t('analyze_precedents')
              )}
            </Button>
          </div>
        </div>

        <Collapsible open={isPrecedentOpen} onOpenChange={setIsPrecedentOpen}>
          <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
            <Card className="border-blue-100 bg-blue-50/50 overflow-hidden">
              <div className="flex">
                <div className="w-1.5 bg-blue-500" />
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                    <Info className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-widest">{t('statutory_gfr_insight')}</span>
                      <Badge variant="outline" className="bg-blue-100/50 border-blue-200 text-blue-700 text-[9px] uppercase h-4 px-1.5 font-bold">{t('dna_centric')}</Badge>
                    </div>
                    <p className="text-sm text-blue-900/80 leading-relaxed font-medium">
                      <span className="font-bold text-blue-900">{precedentResult?.title || "Statutory GFR Precedent:"}</span> {precedentResult?.text || "Executing logic-gates on historical data..."}
                      <span className="block mt-1 font-bold text-blue-700">{precedentResult?.action || "Recommended Action: Pending GFR Analysis."}</span>
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Card className="border-none shadow-lg overflow-hidden bg-white">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder={t('search_bidders')} 
                  className="pl-10 h-9 bg-white" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div 
                    role="button"
                    className={cn(
                      "flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium transition-colors hover:bg-slate-50 cursor-pointer shadow-sm",
                      filterStatus.length > 0 && "bg-blue-50 border-blue-200 text-blue-700"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                    <span>{t('filter')} {filterStatus.length > 0 && `(${filterStatus.length})`}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border-none shadow-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-3 py-2">{t('filter_by_status')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {['Pass', 'Fail'].map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={filterStatus.includes(status)}
                        onCheckedChange={(checked) => {
                          setFilterStatus(prev => 
                            checked ? [...prev, status] : prev.filter(s => s !== status)
                          );
                        }}
                        className="text-sm font-medium focus:bg-slate-50"
                      >
                        {status}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                  {filterStatus.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus([])}
                        className="text-xs font-bold text-blue-600 justify-center focus:bg-blue-50 cursor-pointer"
                      >
                        {t('clear_all')}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>{t('pass')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>{t('fail')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{t('review')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-[50px] p-4 sticky left-0 bg-slate-50/50 z-20 border-r">
                  {/* Select All Checkbox */}
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedBiddersForCompare.length === filteredBidders.length && filteredBidders.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBiddersForCompare(filteredBidders.map(b => b.id));
                        } else {
                          setSelectedBiddersForCompare([]);
                        }
                      }}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[230px] font-bold text-slate-950 sticky left-[50px] bg-slate-50/50 z-10 border-r">{t('bidder_name')}</TableHead>
                {MOCK_DNA_COMPILATION.map((crit) => (
                  <TableHead key={crit.id} className="text-center font-bold text-slate-950 uppercase text-[11px] tracking-widest whitespace-nowrap px-6 border-r border-slate-200 last:border-r-0">
                    <div className="flex flex-col items-center gap-1">
                      <span>{getCritLabel(crit.id, crit.description)}</span>
                      {crit.isMandatory ? (
                        <Badge className="bg-slate-900 text-white hover:bg-slate-900 text-[8px] h-3.5 px-1 font-bold uppercase tracking-tighter">{t('mandatory')}</Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-300 text-slate-500 text-[8px] h-3.5 px-1 font-bold uppercase tracking-tighter">{t('optional')}</Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="font-bold text-slate-950 px-6 border-l border-slate-200">
                  {t('collusion_index')}
                </TableHead>
                <TableHead className="font-bold text-slate-950 px-6">{t('analysis_actions')}</TableHead>
                <TableHead className="font-bold text-slate-950 text-right">{t('overall_status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showApexLive && (
                <TableRow className="bg-blue-50/50 border-blue-200 animate-in slide-in-from-top-4 duration-700">
                  <TableCell className="p-4 sticky left-0 bg-blue-50/50 z-20 border-r">
                    <div className="flex items-center justify-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" checked={false} readOnly />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 sticky left-[50px] bg-blue-50/50 z-10 border-r">
                    <div className="flex flex-col">
                      <span className="font-black text-blue-900">Apex Infrastructure</span>
                      <span className="text-[10px] text-blue-400 font-mono">ID: APEX-LIVE-SYNC</span>
                    </div>
                  </TableCell>
                  {MOCK_DNA_COMPILATION.map((crit) => (
                    <TableCell key={crit.id} className="text-center px-6 border-r border-slate-100 last:border-r-0">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "inline-flex items-center justify-center p-1.5 rounded-lg border-2 transition-all",
                          apexStatus === 'processing' ? "border-amber-500/20 bg-amber-50 text-amber-600 animate-pulse" : "border-green-500/20 bg-green-50 text-green-600"
                        )}>
                          {apexStatus === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="px-6 border-l border-slate-200">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                       <span className="text-[10px] font-black text-blue-600 uppercase">{t('live_dna_stream')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    {apexStatus === 'processing' ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tight">{t('processing_live')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tight">{t('verified')}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(
                      "uppercase text-[10px] font-black tracking-widest",
                      apexStatus === 'processing' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {apexStatus === 'processing' ? t('evaluating') : t('pass')}
                    </Badge>
                  </TableCell>
                </TableRow>
              )}
              {filteredBidders.length > 0 ? filteredBidders.filter(b => !showApexLive || b.name !== 'Apex Infrastructure Pvt Ltd').map((bidder) => (
                <TableRow key={bidder.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="p-4 sticky left-0 bg-white group-hover:bg-slate-50/50 transition-colors z-20 border-r">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedBiddersForCompare.includes(bidder.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBiddersForCompare(prev => [...prev, bidder.id]);
                          } else {
                            setSelectedBiddersForCompare(prev => prev.filter(id => id !== bidder.id));
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 sticky left-[50px] bg-white group-hover:bg-slate-50/50 transition-colors z-10 border-r shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col">
                      <span className="font-bold">{bidder.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{t('reg') || 'REG'}: {bidder.id.toUpperCase()}</span>
                    </div>
                  </TableCell>
                  {MOCK_DNA_COMPILATION.map((crit) => {
                    const status = bidder.criteria[crit.id].status;
                    const extractedValue = bidder.criteria[crit.id].extractedValue;
                    return (
                      <TableCell key={crit.id} className="text-center px-6 border-r border-slate-100 last:border-r-0">
                        <div className="flex flex-col items-center">
                          <button 
                            onClick={() => openModal(bidder, bidder.criteria[crit.id])}
                            className={`inline-flex items-center justify-center p-1.5 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${
                              status === 'Pass' ? 'border-green-500/20 bg-green-50 text-green-600' :
                              'border-red-500/20 bg-red-50 text-red-600'
                            }`}
                          >
                            {status === 'Pass' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          </button>
                          
                          {crit.category === 'Financial' && extractedValue && (
                            <div className="mt-1.5 flex flex-col items-center">
                              <span className="text-[9px] font-black text-slate-600 tracking-tight leading-none">
                                {translateValue(extractedValue)}
                              </span>
                              <FinancialSparkline 
                                value={extractedValue} 
                                category={crit.category} 
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Feature 1: Bharat Edge-Case Indicators in Matrix */}
                        {bidder.id === 'bid_1' && crit.id === 'crit_4' && (
                          <div className="mt-1 flex justify-center">
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[8px] h-3 px-1 hover:bg-emerald-100">{translateValue('STAMP OK')}</Badge>
                          </div>
                        )}
                        {bidder.id === 'bid_2' && crit.id === 'crit_1' && (
                          <div className="mt-1 flex justify-center">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[8px] h-3 px-1 hover:bg-blue-100">{t('translated') || 'TRANSLATED'}</Badge>
                          </div>
                        )}
                        {/* Feature 2: Cross-Document Consistency Flag */}
                        {bidder.id === 'bid_4' && crit.id === 'crit_3' && (
                          <div className="mt-1 flex justify-center">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFraudModalOpen(true);
                                setSelectedBidder(bidder);
                              }}
                              className="bg-rose-100 text-rose-700 border border-rose-200 text-[8px] font-bold h-4 px-1.5 rounded-sm hover:bg-rose-200 transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <ShieldX className="w-2.5 h-2.5" />
                              {t('critical_anomaly')}
                            </button>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="px-6 border-l border-slate-200">
                    {/* Unified Bidder Risk Score */}
                    <div className="group/risk relative cursor-help">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-8 h-8 -rotate-90">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="text-slate-100"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray={88}
                              strokeDashoffset={88 - (88 * bidder.riskScore) / 100}
                              strokeLinecap="round"
                              className={cn(
                                bidder.riskScore < 30 ? "text-green-500" :
                                bidder.riskScore < 70 ? "text-amber-500" :
                                "text-red-500"
                              )}
                            />
                          </svg>
                          <span className="absolute text-[9px] font-black">{bidder.riskScore}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-tight",
                            bidder.riskScore < 30 ? "text-green-600" :
                            bidder.riskScore < 70 ? "text-amber-600" :
                            "text-red-600"
                          )}>
                            {bidder.riskScore < 30 ? t('verified_network') :
                             bidder.riskScore < 70 ? t('anomaly_detected') :
                             t('collusion_alert')}
                          </span>
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-2xl opacity-0 group-hover/risk:opacity-100 transition-all pointer-events-none z-50 translate-y-2 group-hover/risk:translate-y-0">
                        <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold uppercase tracking-widest">{t('gfr_defensibility_index')}</span>
                        </div>
                        <div className="space-y-1.5">
                          {bidder.riskAnomalies.length > 0 ? bidder.riskAnomalies.map((anomaly, i) => (
                            <div key={i} className="text-[10px] flex items-start gap-2 text-slate-300 leading-tight">
                              <div className="w-1 h-1 rounded-full bg-slate-500 mt-1 shrink-0" />
                              {anomaly}
                            </div>
                          )) : (
                            <div className="text-[10px] text-slate-400 italic">{t('no_anomalies')}</div>
                          )}
                        </div>
                        <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      {bidder.overallStatus === 'Fail' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setRejectionBidder(bidder);
                            setIsRejectionModalOpen(true);
                          }}
                          className="h-7 text-[10px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50 px-2 gap-1.5 shadow-sm"
                        >
                          <FileWarning className="w-3.5 h-3.5" />
                          {t('gen_rejection_notice')}
                        </Button>
                      )}
                      {bidder.overallStatus === 'Pass' && (
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <FileCheck className="w-3.5 h-3.5" />
                          {t('ready_for_award')}
                        </div>
                      )}
                      {bidder.overallStatus === 'Needs Review' && (
                        <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Action Required
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 gap-1 px-2 border border-blue-100"
                        onClick={() => startLiveEvaluation(bidder.name)}
                        disabled={isLiveEvaluating}
                      >
                        <Sparkles className="w-3 h-3" />
                        Live DNA Verification
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {role === 'Director' && bidder.overallStatus === 'Pass' ? (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Pending Senior Sign-off</Badge>
                    ) : getStatusBadge(bidder.overallStatus)}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={MOCK_DNA_COMPILATION.length + 4} className="h-32 text-center text-slate-400 font-medium italic">
                    No bidders match your current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {isModalOpen && selectedBidder && selectedCriterion && (
        <HITLModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bidderName={selectedBidder.name}
          criterion={selectedCriterion}
          isFraud={isFraudModalOpen && selectedBidder.id === 'bid_4'}
        />
      )}

      {/* Rejection Notice Modal */}
      <Dialog open={isRejectionModalOpen} onOpenChange={setIsRejectionModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-slate-100 border-none overflow-hidden">
          <div className="flex flex-col h-[80vh]">
            <DialogHeader className="p-6 bg-slate-900 text-white flex-row items-center justify-between space-y-0">
              <div>
                <DialogTitle className="text-xl font-bold">Legal Rejection Notice Generator</DialogTitle>
                <DialogDescription className="text-slate-400">Previewing formal rejection letter for {rejectionBidder?.name}</DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-slate-800 border-slate-700 text-white h-9 px-4 gap-2"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" /> Print
                </Button>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto p-12 flex justify-center">
              {/* Mock PDF Document */}
              <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-20 flex flex-col font-serif relative">
                {/* Letterhead */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-8 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold uppercase tracking-tighter">Central Reserve Police Force</h1>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Government of India | Procurement Division</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase">Official Memorandum</p>
                    <p className="text-[10px] text-slate-500 font-mono">REF: CRPF/CONST/2026/REJ/{rejectionBidder?.id.toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-right mb-12 text-sm italic">
                  Dated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <div className="mb-12">
                  <p className="text-sm font-bold mb-1">To,</p>
                  <p className="text-sm font-bold">{rejectionBidder?.name}</p>
                  <p className="text-sm text-slate-600 italic">Corporate Office Address registered in GeM Portal</p>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-bold underline mb-4">Subject: Rejection of Technical Bid for CRPF Construction Services 2026.</p>
                  
                  <div className="space-y-6 text-sm leading-relaxed text-slate-800">
                    <p>Dear {rejectionBidder?.name},</p>
                    <p>With reference to your bid submission for the subject tender, we regret to inform you that after careful technical evaluation by the Procurement Committee, your bid has been rejected for further participation.</p>
                    
                    <div className="p-6 bg-slate-50 border-l-4 border-rose-500 my-6">
                      <p className="font-bold mb-2 uppercase text-xs text-rose-700">Reason for Rejection:</p>
                      <p className="font-medium italic">"Failing Criterion 2: Minimum Annual Turnover of ₹5 Crore. AI-Extracted value from audited balance sheets was ₹3.8 Crore, which is below the mandatory threshold."</p>
                    </div>

                    <p>As per the GFR guidelines, you may file an appeal within 7 working days from the date of this notice by contacting the Grievance Redressal Officer.</p>
                    <p>We thank you for your interest in government procurement.</p>
                  </div>
                </div>

                <div className="mt-auto pt-12">
                  <div className="w-48 h-12 bg-slate-50 border-b border-slate-300 mb-2 flex items-end p-2 italic text-slate-400">
                    Digitally Signed
                  </div>
                  <p className="text-sm font-bold underline">Procurement Director</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Directorate General, CRPF</p>
                </div>

                {/* Confidential Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-slate-50/50 text-8xl font-black pointer-events-none select-none uppercase tracking-[20px]">
                  Rejected
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-white border-t flex items-center justify-between">
              <div className="text-xs text-slate-500 italic">
                Document ID: {rejectionBidder?.id}-REF-9921
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2 font-bold px-6 border-slate-300"
                  onClick={() => {
                    const content = `REJECTION NOTICE: ${rejectionBidder?.name}\nReason: Turnover below threshold.`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Rejection_Notice_${rejectionBidder?.name}.txt`;
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                <Button 
                  className="bg-slate-900 text-white hover:bg-slate-800 gap-2 font-bold px-8"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const originalText = btn.innerText;
                    btn.innerText = 'Sent Successfully!';
                    btn.disabled = true;
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.disabled = false;
                    }, 2000);
                  }}
                >
                  <Mail className="w-4 h-4" /> Email Vendor
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent className="max-w-md bg-white border-none shadow-2xl">
          <DialogHeader>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <DialogTitle className="text-xl">Finalize Evaluation?</DialogTitle>
            <DialogDescription>
              This will lock the current matrix selections and notify the Procurement Director for final sign-off. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Evaluation Summary</div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-600">Total Bidders</span>
                <span className="text-slate-900">7</span>
              </div>
              <div className="flex justify-between text-sm font-bold mt-1">
                <span className="text-emerald-600">Qualified</span>
                <span className="text-emerald-700">4</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setIsConfirming(false)} className="font-bold text-slate-500">
              Go Back
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8 text-white min-w-[160px]"
              disabled={isFinalizing}
              onClick={() => {
                setIsFinalizing(true);
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 1500);
              }}
            >
              {isFinalizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Finalizing...
                </>
              ) : (
                'Confirm & Finalize'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BidderCompareModal 
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedBidders={MOCK_BIDDERS.filter(b => selectedBiddersForCompare.includes(b.id))}
      />
    </div>
  );
}
