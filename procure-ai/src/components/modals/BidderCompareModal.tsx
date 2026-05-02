'use client';

import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
} from "@/components/ui/dialog";
import { Bidder, MOCK_DNA_COMPILATION } from '@/lib/mockData';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Scale } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BidderCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBidders: Bidder[];
}

export function BidderCompareModal({ isOpen, onClose, selectedBidders }: BidderCompareModalProps) {
  if (selectedBidders.length === 0) return null;

  // Function to determine "winning" value (highest numeric value or pass status)
  const isWinningValue = (bidder: Bidder, critId: string) => {
    const currentVal = bidder.criteria[critId].extractedValue;
    if (!currentVal) return false;

    // Simple heuristic: if it contains a number, find the max among selected bidders
    const extractNum = (s: string) => {
      const match = s.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : null;
    };

    const currentNum = extractNum(currentVal);
    if (currentNum === null) return bidder.criteria[critId].status === 'Pass';

    const allNums = selectedBidders
      .map(b => extractNum(b.criteria[critId].extractedValue || ''))
      .filter((n): n is number => n !== null);

    return currentNum === Math.max(...allNums);
  };

  return (
    <ShadcnDialog open={isOpen} onOpenChange={onClose}>
      <ShadcnDialogContent className="max-w-6xl bg-white border-none shadow-2xl p-0 overflow-hidden">
        <ShadcnDialogHeader className="p-6 bg-slate-900 text-white flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <ShadcnDialogTitle className="text-xl font-bold">Side-by-Side Bidder Comparison</ShadcnDialogTitle>
              <p className="text-slate-400 text-xs">Direct technical & financial alignment across {selectedBidders.length} vendors</p>
            </div>
          </div>
        </ShadcnDialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-1/4 p-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-r">Criteria / Requirement</th>
                {selectedBidders.map(bidder => (
                  <th key={bidder.id} className="p-4 text-left border-r last:border-r-0">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{bidder.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">REG: {bidder.id.toUpperCase()}</span>
                      <div className="mt-2">
                        {bidder.overallStatus === 'Pass' && <Badge className="bg-green-100 text-green-700 border-green-200">Pass</Badge>}
                        {bidder.overallStatus === 'Fail' && <Badge className="bg-red-100 text-red-700 border-red-200">Fail</Badge>}
                        {bidder.overallStatus === 'Needs Review' && <Badge className="bg-amber-100 text-amber-700 border-amber-200">Review</Badge>}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_DNA_COMPILATION.map(crit => (
                <tr key={crit.id} className="border-b border-slate-100 group">
                  <td className="p-4 border-r bg-slate-50/30 group-hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{crit.description}</span>
                        {crit.isMandatory ? (
                          <Badge className="bg-slate-900 text-white hover:bg-slate-900 text-[8px] h-4 px-1.5 font-bold uppercase tracking-tighter">Mandatory</Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-300 text-slate-500 text-[8px] h-4 px-1.5 font-bold uppercase tracking-tighter">Optional</Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 italic leading-tight">{crit.requirement}</span>
                    </div>
                  </td>
                  {selectedBidders.map(bidder => {
                    const data = bidder.criteria[crit.id];
                    const isWinner = isWinningValue(bidder, crit.id);
                    return (
                      <td 
                        key={bidder.id} 
                        className={cn(
                          "p-4 border-r last:border-r-0 align-top transition-colors",
                          isWinner && "bg-emerald-50/50"
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {data.status === 'Pass' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                            {data.status === 'Fail' && <XCircle className="w-4 h-4 text-red-600" />}
                            {data.status === 'Needs Review' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                            <span className={cn(
                              "text-sm font-bold",
                              data.status === 'Pass' ? "text-green-900" :
                              data.status === 'Fail' ? "text-red-900" :
                              "text-amber-900"
                            )}>
                              {data.extractedValue || 'N/A'}
                            </span>
                          </div>
                          {isWinner && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 border border-emerald-200 rounded text-[9px] font-black text-emerald-700 uppercase tracking-tight w-fit">
                              Leading Value
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-slate-50/50">
                <td className="p-4 border-r font-bold text-xs text-slate-500 uppercase tracking-widest">Risk Summary</td>
                {selectedBidders.map(bidder => (
                  <td key={bidder.id} className="p-4 border-r last:border-r-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          bidder.riskScore < 30 ? "bg-green-500" :
                          bidder.riskScore < 70 ? "bg-amber-500" :
                          "bg-red-500"
                        )} />
                        <span className="text-sm font-bold text-slate-900">{bidder.riskScore}/100</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {bidder.riskAnomalies.length > 0 ? (
                          bidder.riskAnomalies.map((anomaly, i) => (
                            <div key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                              {anomaly}
                            </div>
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">No anomalies detected</span>
                        )}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}
