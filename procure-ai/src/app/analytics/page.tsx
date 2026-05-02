'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  PieChart, 
  ArrowLeft,
  Calendar,
  ChevronDown,
  Loader2,
  FileDown,
  CheckCircle2 as CheckIcon
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DATA_SETS: Record<string, any> = {
  'Last 7 Days': {
    totalBids: 42,
    participation: [
      { m: 'Mon', v: 8, h: 40 },
      { m: 'Tue', v: 12, h: 60 },
      { m: 'Wed', v: 15, h: 75 },
      { m: 'Thu', v: 5, h: 25 },
      { m: 'Fri', v: 18, h: 90 },
      { m: 'Sat', v: 4, h: 20 },
      { m: 'Sun', v: 2, h: 10 },
    ],
    outcomes: [
      { label: 'Technical Pass', val: '75%', color: 'bg-emerald-500', count: 32 },
      { label: 'Technical Fail', val: '20%', color: 'bg-rose-500', count: 8 },
      { label: 'Under Review', val: '5%', color: 'bg-amber-500', count: 2 },
    ],
    stats: [
      { label: 'Avg. Eval Time', value: '1.2 Days', trend: '-22%', icon: TrendingUp },
      { label: 'AI Savings', value: '₹1.4 Lakh', trend: '+5%', icon: ShieldCheck },
      { label: 'Human Touchpoints', value: '0.8', trend: '-15%', icon: Users },
      { label: 'Audit Compliance', value: '100%', trend: '+0.0%', icon: BarChart3 },
    ]
  },
  'Last 30 Days': {
    totalBids: 482,
    participation: [
      { m: 'Wk 1', v: 110, h: 100 },
      { m: 'Wk 2', v: 85, h: 77 },
      { m: 'Wk 3', v: 95, h: 86 },
      { m: 'Wk 4', v: 102, h: 92 },
    ],
    outcomes: [
      { label: 'Technical Pass', val: '60%', color: 'bg-emerald-500', count: 289 },
      { label: 'Technical Fail', val: '30%', color: 'bg-rose-500', count: 145 },
      { label: 'Under Review', val: '10%', color: 'bg-amber-500', count: 48 },
    ],
    stats: [
      { label: 'Avg. Eval Time', value: '4.2 Days', trend: '-12%', icon: TrendingUp },
      { label: 'AI Savings', value: '₹12.4 Lakh', trend: '+18%', icon: ShieldCheck },
      { label: 'Human Touchpoints', value: '1.4', trend: '-45%', icon: Users },
      { label: 'Audit Compliance', value: '99.8%', trend: '+0.2%', icon: BarChart3 },
    ]
  },
  'Last 3 Months': {
    totalBids: 1240,
    participation: [
      { m: 'Apr', v: 380, h: 80 },
      { m: 'May', v: 420, h: 88 },
      { m: 'Jun', v: 440, h: 100 },
    ],
    outcomes: [
      { label: 'Technical Pass', val: '55%', color: 'bg-emerald-500', count: 682 },
      { label: 'Technical Fail', val: '35%', color: 'bg-rose-500', count: 434 },
      { label: 'Under Review', val: '10%', color: 'bg-amber-500', count: 124 },
    ],
    stats: [
      { label: 'Avg. Eval Time', value: '5.1 Days', trend: '+5%', icon: TrendingUp },
      { label: 'AI Savings', value: '₹34.8 Lakh', trend: '+25%', icon: ShieldCheck },
      { label: 'Human Touchpoints', value: '1.6', trend: '-30%', icon: Users },
      { label: 'Audit Compliance', value: '99.5%', trend: '-0.1%', icon: BarChart3 },
    ]
  },
  'Last 6 Months': {
    totalBids: 2150,
    participation: [
      { m: 'Jan', v: 210, h: 40 },
      { m: 'Feb', v: 340, h: 65 },
      { m: 'Mar', v: 420, h: 80 },
      { m: 'Apr', v: 220, h: 42 },
      { m: 'May', v: 460, h: 88 },
      { m: 'Jun', v: 500, h: 100 },
    ],
    outcomes: [
      { label: 'Technical Pass', val: '58%', color: 'bg-emerald-500', count: 1247 },
      { label: 'Technical Fail', val: '32%', color: 'bg-rose-500', count: 688 },
      { label: 'Under Review', val: '10%', color: 'bg-amber-500', count: 215 },
    ],
    stats: [
      { label: 'Avg. Eval Time', value: '4.8 Days', trend: '-8%', icon: TrendingUp },
      { label: 'AI Savings', value: '₹58.2 Lakh', trend: '+40%', icon: ShieldCheck },
      { label: 'Human Touchpoints', value: '1.5', trend: '-20%', icon: Users },
      { label: 'Audit Compliance', value: '99.7%', trend: '+0.1%', icon: BarChart3 },
    ]
  },
  'Last Year': {
    totalBids: 4850,
    participation: [
      { m: 'Q1', v: 1100, h: 80 },
      { m: 'Q2', v: 950, h: 70 },
      { m: 'Q3', v: 1400, h: 100 },
      { m: 'Q4', v: 1200, h: 85 },
    ],
    outcomes: [
      { label: 'Technical Pass', val: '62%', color: 'bg-emerald-500', count: 3007 },
      { label: 'Technical Fail', val: '28%', color: 'bg-rose-500', count: 1358 },
      { label: 'Under Review', val: '10%', color: 'bg-amber-500', count: 485 },
    ],
    stats: [
      { label: 'Avg. Eval Time', value: '4.5 Days', trend: '-15%', icon: TrendingUp },
      { label: 'AI Savings', value: '₹1.2 Cr', trend: '+120%', icon: ShieldCheck },
      { label: 'Human Touchpoints', value: '1.4', trend: '-55%', icon: Users },
      { label: 'Audit Compliance', value: '99.9%', trend: '+0.3%', icon: BarChart3 },
    ]
  }
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const currentData = DATA_SETS[timeRange] || DATA_SETS['Last 30 Days'];

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
  };

  const triggerFileDownload = () => {
    const reportContent = `
PROCURE-AI ENTERPRISE ANALYTICS REPORT
--------------------------------------
Range: ${timeRange}
Generated: ${new Date().toLocaleString()}

SUMMARY METRICS:
${currentData.stats.map((s: any) => `- ${s.label}: ${s.value} (${s.trend})`).join('\n')}

PARTICIPATION VOLUME:
${currentData.participation.map((p: any) => `- ${p.m}: ${p.v} Bids`).join('\n')}

OUTCOME DISTRIBUTION:
${currentData.outcomes.map((o: any) => `- ${o.label}: ${o.val} (${o.count} Decisions)`).join('\n')}

--------------------------------------
CONFIDENTIAL - GOVERNMENT OF INDIA PROCUREMENT DATA
    `;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ProcureAI_Report_${timeRange.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isDownloading && downloadProgress < 100) {
      const timer = setTimeout(() => {
        setDownloadProgress(prev => Math.min(prev + Math.random() * 15, 100));
      }, 300);
      return () => clearTimeout(timer);
    } else if (downloadProgress === 100) {
      triggerFileDownload();
      const timer = setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDownloading, downloadProgress]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Procurement Analytics</h2>
            <p className="text-slate-500 mt-1">Deep-dive insights into bidder performance and evaluation trends.</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div 
              role="button"
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              {timeRange}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Select Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last Year'].map((range) => (
                <DropdownMenuItem 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className="flex items-center justify-between cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                >
                  <span className="font-medium">{range}</span>
                  {timeRange === range && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Monthly Participation Volume
                </CardTitle>
                <CardDescription>Number of technical bids processed by ProcureAI</CardDescription>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-100">Total: {currentData.totalBids} Bids</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full flex items-end justify-between relative px-2">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full border-t border-slate-100" />
                ))}
              </div>
              
              {currentData.participation.map((d: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-4 z-10 flex-1">
                  <div className="relative group w-12 flex flex-col justify-end h-[240px]">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 ease-out hover:from-blue-500 hover:to-blue-300 shadow-sm" 
                      style={{ height: `${d.h}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap shadow-xl">
                        {d.v} Bids
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{d.m}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-[#0F172A] text-white">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Outcome Distribution
            </CardTitle>
            <CardDescription className="text-slate-500">{timeRange === 'Last Year' ? 'FY 2025-26 Overview' : 'Active Period Trends'}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray={`${parseInt(currentData.outcomes[0].val)} ${100 - parseInt(currentData.outcomes[0].val)}`} strokeDashoffset="0" className="transition-all duration-700" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="3" strokeDasharray={`${parseInt(currentData.outcomes[1].val)} ${100 - parseInt(currentData.outcomes[1].val)}`} strokeDashoffset={`-${parseInt(currentData.outcomes[0].val)}`} className="transition-all duration-700" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${parseInt(currentData.outcomes[2].val)} ${100 - parseInt(currentData.outcomes[2].val)}`} strokeDashoffset={`-${parseInt(currentData.outcomes[0].val) + parseInt(currentData.outcomes[1].val)}`} className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{currentData.totalBids}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Total Decisions</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {currentData.outcomes.map((item: any, i: number) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-white">{item.val}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} opacity-20 transition-all duration-700`} style={{ width: item.val }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {currentData.stats.map((stat: any, i: number) => (
          <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-slate-400" />
                <Badge className={stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}>
                  {stat.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Evaluation Performance</CardTitle>
            <CardDescription>Metrics for the last 5 tenders processed by the engine.</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 font-bold gap-2"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Download Full Report
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">Tender Reference</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100 text-center">Bidders</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100 text-center">AI Confidence</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { ref: 'CRPF/CS/2026/04', bids: 12, conf: '98.2%', status: 'Completed' },
                  { ref: 'BSF/IT/2025/11', bids: 8, conf: '96.5%', status: 'Completed' },
                  { ref: 'CISF/MED/2026/01', bids: 24, conf: '99.1%', status: 'In Progress' },
                  { ref: 'NSG/EQUIP/2025/08', bids: 5, conf: '97.8%', status: 'Completed' },
                  { ref: 'ITBP/INFRA/2026/02', bids: 15, conf: '94.2%', status: 'Flagged' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.ref}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-mono">{row.bids}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-mono text-[10px]">{row.conf}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-block ${
                        row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        row.status === 'Flagged' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {row.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDownloading}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {downloadProgress < 100 ? (
                <>
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  Generating Enterprise Report
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  Report Generated Successfully
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {downloadProgress < 100 
                ? "Compiling historical data, AI decision audits, and participation trends for the selected period."
                : "Your encrypted PDF report has been generated and is now being downloaded to your local system."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {downloadProgress < 100 ? 'Processing Batch Data' : 'Download Ready'}
              </span>
              <span className="text-xs font-bold text-blue-600">{Math.floor(downloadProgress)}%</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
