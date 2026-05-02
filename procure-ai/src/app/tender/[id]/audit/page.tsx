'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  History, 
  ShieldCheck, 
  User, 
  Download, 
  Search,
  Lock,
  ChevronRight,
  CheckCircle2,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { MOCK_AUDIT_LOGS } from '@/lib/mockData';
import { useState } from 'react';

export default function AuditTrailPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerified, setLastVerified] = useState<string>('Successful');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => 
    log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleExport = () => {
    setIsExporting(true);
    const report = `
PROCURE-AI IMMUTABLE AUDIT LOG
------------------------------
Generated: ${new Date().toLocaleString()}
Tender: CRPF Construction Services 2026

LOG ENTRIES:
${MOCK_AUDIT_LOGS.map(l => `[${l.timestamp}] ${l.action} by ${l.user}: ${l.details}`).join('\n')}

------------------------------
END OF AUDIT TRAIL
INTEGRITY HASH: 0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d
    `;
    setTimeout(() => {
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Audit_Log_CRPF_2026.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
      setToastMessage('Audit report exported successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const handleVerify = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setLastVerified('Re-hashing blocks...');
    setTimeout(() => {
      setLastVerified('Verifying Merkle Roots...');
      setTimeout(() => {
        setLastVerified('Anchoring to Hyperledger...');
        setTimeout(() => {
          setIsVerifying(false);
          setLastVerified('Successful');
          setToastMessage('Blockchain integrity verified successfully!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }, 1000);
      }, 1200);
    }, 800);
  };
  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <span>Tenders</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900">CRPF Construction Services 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Audit Trail & Compliance Ledger</h2>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-6 text-white"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export Audit Report (PDF)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-lg bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                Immutable Event Ledger
              </CardTitle>
              <CardDescription>Chronological record of all system and officer actions.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Filter events..." 
                className="pl-10 h-8 bg-white border-slate-200 text-slate-900" 
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[180px] font-bold">Timestamp</TableHead>
                <TableHead className="w-[150px] font-bold">Action</TableHead>
                <TableHead className="w-[150px] font-bold">User/Agent</TableHead>
                <TableHead className="font-bold">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-mono text-xs text-slate-500">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${
                      log.action === 'Manual Override' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                      log.action === 'System Flag' ? 'text-red-700 bg-red-50 border-red-200' :
                      'text-blue-700 bg-blue-50 border-blue-200'
                    }`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.user === 'Gemini-1.5-Pro' ? (
                        <ShieldCheck className="w-4 h-4 text-slate-900" />
                      ) : (
                        <User className="w-4 h-4 text-slate-500" />
                      )}
                      <span className="text-sm font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 italic">
                    {log.details}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium italic">
                    No matching events found in the ledger.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="border-none shadow-lg bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Blockchain Integrity</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every action in ProcureAI is cryptographically hashed and anchored to our private hyperledger. 
              This ensures an immutable audit trail for judicial review.
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Latest Root Hash</p>
                <p className="text-xs font-mono text-blue-400 truncate">0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d</p>
              </div>
              <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${lastVerified === 'Successful' ? 'text-green-400' : 'text-blue-400 animate-pulse'}`}>
                {lastVerified === 'Successful' ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4 animate-spin" />}
                <span>Verification {lastVerified}</span>
              </div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold h-11 border-none shadow-lg"
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isVerifying ? 'Verifying Integrity...' : 'Verify Integrity Now'}
            </Button>
          </div>
          <div className="absolute -bottom-12 -right-12 opacity-5">
            <ShieldCheck className="w-64 h-64" />
          </div>
        </Card>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 z-50 border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
