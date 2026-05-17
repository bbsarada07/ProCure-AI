"use client";

import React from "react";
import { FileText } from "lucide-react";

export default function DocumentViewer() {
  return (
    <section className="w-1/2 border-r border-neutral-800 bg-neutral-900/30 relative flex flex-col">
      <div className="p-4 border-b border-neutral-800/50 flex items-center gap-2 text-sm text-neutral-400 shrink-0 bg-[#0A0A0A]">
        <FileText className="w-4 h-4" /> Source Document
      </div>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto bg-[#0A0A0A] p-10 rounded-xl border border-neutral-800 shadow-xl text-neutral-300 text-sm leading-relaxed font-serif min-h-full">
          <h2 className="text-xl font-bold text-white mb-6 text-center border-b border-neutral-800 pb-4">
            MASTER SERVICES AGREEMENT
          </h2>
          <p className="mb-6">This Agreement is entered into by and between the parties...</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">4. Term and Termination</h3>
          <p className="mb-4">
            4.1 The initial term is one year.{" "}
            <span className="bg-orange-500/20 text-orange-200 px-1 py-0.5 rounded border border-orange-500/30">
              Unless terminated with 15 days notice, it auto-renews.
            </span>
          </p>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">10. Liability</h3>
          <div className="relative group cursor-pointer mt-4">
            <div className="absolute -inset-2 bg-red-500/10 border border-red-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <p className="relative z-10 p-3 bg-red-500/5 text-red-100 border-l-2 border-red-500 rounded-r-md">
              <span className="font-bold text-red-400">10.2 Limitation.</span> The Vendor shall
              indemnify Client for all claims. There shall be no cap on liability regarding data
              breaches or gross negligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
