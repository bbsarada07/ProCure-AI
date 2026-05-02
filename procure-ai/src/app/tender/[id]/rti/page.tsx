'use client';

import { useState } from 'react';
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
  Mail, 
  ChevronRight, 
  Download, 
  FileText, 
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Printer,
  History,
  AlertTriangle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { MOCK_BIDDERS } from '@/lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

// Mock RTI Data
const MOCK_RTI_REQUESTS = [
  {
    id: 'RTI-2026-004',
    bidderId: 'bid_3',
    bidderName: 'City Buildcon',
    receivedDate: '2026-04-24 09:30',
    status: 'Pending',
    subject: 'Request for clarification on technical disqualification'
  },
  {
    id: 'RTI-2026-005',
    bidderId: 'bid_8',
    bidderName: 'Heritage Foundations',
    receivedDate: '2026-04-25 11:15',
    status: 'Pending',
    subject: 'Query regarding similar project experience calculation'
  },
  {
    id: 'RTI-2026-002',
    bidderId: 'bid_6',
    bidderName: 'Falcon Constructions',
    receivedDate: '2026-04-20 14:20',
    status: 'Replied',
    subject: 'Clarification on joint venture documentation'
  }
];

export default function RTIManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useAppContext();
  const { showToast } = useToast();

  const triggerToast = (message: string) => {
    showToast(message, 'success');
  };

  const filteredRequests = MOCK_RTI_REQUESTS.filter(req => 
    req.bidderName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateResponse = (request: any) => {
    setSelectedRequest(request);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsModalOpen(true);
    }, 1500);
  };

  const getBidderData = (bidderId: string) => {
    return MOCK_BIDDERS.find(b => b.id === bidderId);
  };

  const generateFormalText = (request: any) => {
    const bidder = getBidderData(request.bidderId);
    if (!bidder) return "Data not available.";

    const failedCriteria = Object.values(bidder.criteria).filter(c => c.status === 'Fail');
    const reasonText = failedCriteria.length > 0 
      ? `your bid was technically disqualified under ${failedCriteria.map(c => `Clause for ${c.description}`).join(', ')}. ${failedCriteria.map(c => `Extracted ${c.description} was ${c.extractedValue} against the required ${c.requirement}`).join('. ')}.`
      : "your bid evaluation is complete.";

    const hash = Math.random().toString(36).substring(2, 15).toUpperCase();

    return `To ${bidder.name},

With reference to your RTI query regarding Tender CRPF-2026-01 (CRPF Construction Services 2026), please be informed that ${reasonText}

This decision is final and based on the automated evaluation matrix verified by the Procurement Division. This record is logged under Cryptographic Hash: ${hash}.

Best Regards,
Procurement Officer, CRPF Division
Government of India`;
  };

  const handleDownload = () => {
    if (!selectedRequest) return;
    const text = generateFormalText(selectedRequest);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RTI_Response_${selectedRequest.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast("RTI Response exported successfully.");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <span>Tenders</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900">RTI Management</span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-tight">RTI Auto-Responder</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 border-slate-200"
            onClick={() => triggerToast("Synchronizing RTI archives from Central Statutory Ledger...")}
          >
            <History className="w-4 h-4" />
            RTI History
          </Button>
          <Button 
            className="bg-slate-900 hover:bg-slate-800 gap-2 text-white"
            onClick={() => triggerToast("Initializing secure filter topology...")}
          >
            <Filter className="w-4 h-4" />
            Filter Requests
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-lg overflow-hidden bg-white">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                RTI Inbox
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search RTI requests..." 
                  className="pl-10 h-9 bg-white" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>Review and respond to Right to Information requests from bidders.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30">
                  <TableHead className="w-[180px] font-bold text-slate-950">Request ID</TableHead>
                  <TableHead className="w-[220px] font-bold text-slate-950">Bidder Name</TableHead>
                  <TableHead className="font-bold text-slate-950">Subject</TableHead>
                  <TableHead className="w-[160px] font-bold text-slate-950">Received Date</TableHead>
                  <TableHead className="w-[120px] font-bold text-slate-950 text-center">Status</TableHead>
                  <TableHead className="w-[150px] font-bold text-slate-950 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-blue-600">{request.id}</TableCell>
                    <TableCell className="font-bold text-slate-900">{request.bidderName}</TableCell>
                    <TableCell className="text-slate-600 truncate max-w-[300px]">{request.subject}</TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {request.receivedDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={request.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'Pending' ? (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 px-3 gap-1.5 shadow-sm"
                          onClick={() => handleGenerateResponse(request)}
                          disabled={isGenerating && selectedRequest?.id === request.id}
                        >
                          {isGenerating && selectedRequest?.id === request.id ? (
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          Generate Response
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-slate-500 gap-1.5 hover:bg-slate-100"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsModalOpen(true);
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Sent
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* RTI Response Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl bg-slate-50 p-0 border-none overflow-hidden">
          <div className="flex flex-col h-[80vh]">
            <DialogHeader className="p-6 bg-slate-900 text-white flex-row items-center justify-between space-y-0">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  AI RTI Response Draft
                </DialogTitle>
                <DialogDescription className="text-slate-400">Reviewing automated response for {selectedRequest?.bidderName}</DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-slate-800 border-slate-700 text-white h-9 px-4 gap-2 hover:bg-slate-700"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" /> Print Preview
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-12 flex justify-center">
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
                    <p className="text-xs font-bold uppercase underline">Official Communication</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">REF: CRPF/RTI/2026/REP/{selectedRequest?.id.split('-')[2]}</p>
                  </div>
                </div>

                <div className="text-right mb-12 text-sm italic">
                  Dated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <div className="mb-12">
                  <p className="text-sm font-bold mb-1">To,</p>
                  <p className="text-sm font-bold">{selectedRequest?.bidderName}</p>
                  <p className="text-sm text-slate-600 italic">Subject: Response to RTI Application {selectedRequest?.id}</p>
                </div>

                <div className="flex-1">
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                    {selectedRequest && generateFormalText(selectedRequest)}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">
                      <p className="font-bold uppercase tracking-widest">Digitally Verified</p>
                      <p>ProcureAI Integrity Engine v1.0</p>
                    </div>
                  </div>
                  <div className="w-32 h-12 border-b border-slate-200 flex items-end justify-center pb-1 text-[10px] italic text-slate-400">
                    Officer's Signature
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-white border-t flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                This is a read-only draft generated from the Evaluation Matrix.
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
                <Button 
                  className="bg-slate-900 text-white font-bold gap-2 px-6 hover:bg-slate-800"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download as Official PDF
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
