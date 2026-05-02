'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Eye,
  Edit3,
  Bot,
  Download,
  Loader2
} from 'lucide-react';
import { MOCK_DNA_COMPILATION } from '@/lib/mockData';
import { useRouter, useParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CriteriaSetupPage() {
  const router = useRouter();
  const params = useParams();
  const [criteria, setCriteria] = useState(MOCK_DNA_COMPILATION);
  const [selectedId, setSelectedId] = useState('crit_1');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<any>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setCriteria(prev => prev.map(c => c.id === editingCriterion.id ? editingCriterion : c));
    setEditingCriterion(null);
  };

  const handleFinalize = () => {
    setIsFinalizing(true);
    // Simulate API save
    setTimeout(() => {
      router.push(`/tender/${params.id}/evaluation`);
    }, 1500);
  };

  const DocumentContent = ({ isModal = false }) => (
    <div id={isModal ? "tender-doc-full" : "tender-doc-preview"} className={`${isModal ? 'max-w-4xl' : 'max-w-2xl'} mx-auto p-12 bg-white shadow-sm ${!isModal && 'my-8 border border-slate-100'} min-h-[1000px] relative text-slate-800 font-serif leading-relaxed`}>
      <header className="text-center mb-16 border-b-2 border-double border-slate-200 pb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-1">GOVERNMENT OF INDIA</h1>
        <h2 className="text-xl font-bold text-slate-700 tracking-[0.2em] uppercase">Central Reserve Police Force</h2>
        <div className="mt-6 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Document Reference</span>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded">CRPF/CS/2026/04-V4</span>
        </div>
        <p className="text-sm mt-8 italic text-slate-500">Notice Inviting Tender (NIT)</p>
      </header>

      <section className="space-y-6 mb-12">
        <h3 className="text-lg font-black text-slate-900 border-l-4 border-blue-600 pl-4 uppercase tracking-wide">Section 4.1: Financial Eligibility</h3>
        <p className="text-[15px]">
          The bidder must demonstrate strong financial stability. The <span className="font-bold underline decoration-blue-500/30">minimum average annual turnover</span> of the bidder during the last three financial years (up to 31st March 2025) should not be less than <span className="font-bold bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">₹5,00,00,000 (Rupees Five Crore only)</span>.
        </p>
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 italic leading-normal">
            Note: Audited balance sheets certified by a registered Chartered Accountant (CA) must be submitted as proof of financial compliance.
          </p>
        </div>
      </section>

      <section className="space-y-6 mb-12">
        <h3 className="text-lg font-black text-slate-900 border-l-4 border-slate-300 pl-4 uppercase tracking-wide">Section 4.2: Experience</h3>
        <p className="text-[15px]">
          Bidders must have experience in executing <span className="font-bold underline decoration-slate-300">at least 3 (three) similar works</span> of construction for Government/Semi-Government/PSUs during the last 5 years.
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-l-4 border-slate-300 pl-4 uppercase tracking-wide">Section 5: Statutory Compliance</h3>
        <p className="text-[15px]">
          Valid GST registration and ISO 9001:2015 certifications are mandatory requirements for eligibility. Failure to provide current certificates will result in automatic disqualification at the technical stage.
        </p>
      </section>

      <div className="h-32" />
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <span>Tenders</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900">CRPF Construction Services 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Tender DNA Compiler & Setup</h2>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 min-w-[140px] gap-2"
          onClick={handleFinalize}
          disabled={isFinalizing}
        >
          {isFinalizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Finalizing...
            </>
          ) : (
            'Finalize Tender DNA'
          )}
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Left: Mock PDF Viewer */}
        <Card className="border border-slate-200 shadow-sm bg-white flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur">
            <div className="flex items-center gap-2 text-slate-900">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold">Tender_Document_Draft_V4.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-2 bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  const content = document.getElementById('tender-doc-preview')?.innerText || '';
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'Tender_Document_Draft_V4.txt';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 bg-slate-100/30">
            <DocumentContent />
          </ScrollArea>
        </Card>

        {/* Right: AI Extraction List */}
        <Card className="border-none shadow-lg bg-white overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  Compiled DNA Ledger
                </CardTitle>
                <CardDescription>Verify and approve compiled multidimensional DNA.</CardDescription>
              </div>
              <Badge className="bg-slate-900 text-white">4 Items Found</Badge>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {criteria.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedId === item.id 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500' 
                    : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${
                        item.category === 'Financial' ? 'text-green-700 bg-green-50 border-green-200' :
                        item.category === 'Technical' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        'text-slate-700 bg-slate-100 border-slate-200'
                      }`}>
                        {item.category}
                      </Badge>
                      {item.isMandatory ? (
                        <Badge className="bg-slate-900 text-white hover:bg-slate-900 text-[9px] h-4.5 px-2 font-bold uppercase tracking-tighter">
                          Mandatory
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-slate-300 text-slate-500 text-[9px] h-4.5 px-2 font-bold uppercase tracking-tighter">
                          Optional
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCriterion({...item});
                        }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-900">{item.description}</h4>
                  <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">{item.requirement}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-slate-500 italic">GFR Defensibility: 98%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-400">Approved</Label>
                      <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-white border-none shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-slate-900">Full Document Preview</DialogTitle>
                <DialogDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">CRPF/CS/2026/04-V4 • Official Tender</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-12">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-2 bg-white text-slate-600 border-slate-200"
                onClick={() => {
                  const content = document.getElementById('tender-doc-full')?.innerText || '';
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'Tender_Document_Draft_V4.txt';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download Copy
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 bg-slate-50/50 p-12">
            <DocumentContent isModal />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCriterion} onOpenChange={(open) => !open && setEditingCriterion(null)}>
        <DialogContent className="max-w-md bg-white border-none shadow-2xl">
          <DialogHeader>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Refine Compiled DNA</DialogTitle>
            <DialogDescription>
              Manually adjust the compiled DNA segment to ensure it perfectly matches the tender requirements.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-black uppercase text-slate-400 tracking-widest">DNA Segment Title</Label>
              <Input 
                id="title"
                value={editingCriterion?.description || ''}
                onChange={(e) => setEditingCriterion({...editingCriterion, description: e.target.value})}
                className="h-10 border-slate-200 focus-visible:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req" className="text-xs font-black uppercase text-slate-400 tracking-widest">Requirement Detail</Label>
              <textarea 
                id="req"
                value={editingCriterion?.requirement || ''}
                onChange={(e) => setEditingCriterion({...editingCriterion, requirement: e.target.value})}
                className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 bg-transparent text-sm focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingCriterion(null)} className="text-slate-500 font-bold">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
