"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  UploadCloud,
  Activity,
  ShieldAlert,
  CheckSquare,
  AlertTriangle,
  Download,
  Terminal,
  Loader2,
  Calendar,
  Scale,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DocumentViewer = dynamic(() => import("./DocumentViewer"), {
  ssr: false,
  loading: () => (
    <section className="w-1/2 border-r border-neutral-800 bg-neutral-900/30 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </section>
  ),
});

// Mock data removed in favor of live backend connection.

export default function ContractCrewClient({ id }: { id: string }) {
  const [phase, setPhase] = useState<"upload" | "terminal" | "dashboard">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [backendData, setBackendData] = useState<any>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- UPLOAD HANDLER ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      timeoutRef.current = setTimeout(() => setPhase("terminal"), 600); // Transition to terminal
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleTerminalComplete = useCallback(() => {
    setPhase("dashboard");
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "upload" && (
          <UploadPhase
            key="upload"
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />
        )}
        {phase === "terminal" && (
          <TerminalPhase key="terminal" file={file} onComplete={handleTerminalComplete} onFinalData={setBackendData} />
        )}
        {phase === "dashboard" && <DashboardPhase key="dashboard" file={file} id={id} data={backendData} />}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 1. UPLOAD PHASE
// ==========================================
function UploadPhase({ getRootProps, getInputProps, isDragActive }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center p-8"
    >
      <div className="max-w-2xl w-full text-center">
        <Scale className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">Agentic Contract Review</h1>
        <p className="text-neutral-400 mb-10 text-lg">Upload your contract to deploy the AI Crew.</p>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            isDragActive
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
              : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-700"
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud
            className={cn("w-16 h-16 mb-6 transition-colors", isDragActive ? "text-emerald-500" : "text-neutral-500")}
          />
          <h3 className="text-2xl font-medium mb-3 text-white">
            {isDragActive ? "Drop PDF to deploy agents" : "Drag & drop PDF contract"}
          </h3>
          <p className="text-neutral-500">Only PDF files are supported for agentic analysis.</p>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 2. LIVE EXECUTION CONSOLE
// ==========================================
function TerminalPhase({ file, onComplete, onFinalData }: { file: File | null; onComplete: () => void; onFinalData: (data: any) => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setError("No file provided.");
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchStream() {
      try {
        const formData = new FormData();
        formData.append("file", file as File);

        setLogs(["> System: Initializing CrewAI Multi-Agent framework..."]);

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${backendUrl}/api/v2/saas-analyzer/analyze`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

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
                  if (isMounted) {
                    setLogs((prev) => [...prev, `> System: ${parsed.message}`]);
                    onFinalData(parsed.final_report);
                    setIsDone(true);
                    timeoutId = setTimeout(() => onComplete(), 1500);
                  }
                } else if (parsed.message) {
                  if (isMounted) {
                    setLogs((prev) => [...prev, `> Agent [${parsed.agent}]: ${parsed.message}`]);
                  }
                }
              } catch (err) {
                console.error("Error parsing JSON chunk", err);
              }
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An error occurred during analysis.");
          setLogs((prev) => [...prev, `> System: ! WARNING ! Backend connection failed. ${err.message}`]);
        }
      }
    }

    fetchStream();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [file, onComplete, onFinalData]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-center p-8 bg-[#020202]"
    >
      <div className="w-full max-w-3xl bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)]">
        <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-neutral-400 font-mono tracking-wider uppercase">CrewAI Execution Console</span>
          <div className="ml-auto flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
        </div>
        <div className="p-6 font-mono text-sm leading-relaxed min-h-[300px] flex flex-col justify-end overflow-hidden relative">
          {!isDone && (
            <div className="absolute top-6 right-6 flex items-center gap-2 text-emerald-500/70 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" /> Agents working
            </div>
          )}
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2",
                  log.includes("WARNING") || error ? "text-red-400" : log.includes("System:") ? "text-emerald-500" : "text-neutral-300"
                )}
              >
                <span className="opacity-50 select-none">~</span> {log}
              </div>
            ))}
            {!isDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-3 h-5 bg-emerald-500 inline-block mt-2"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 3. FINAL DASHBOARD
// ==========================================
function DashboardPhase({ file, id, data }: { file: File | null; id: string; data: any }) {
  const [activeTab, setActiveTab] = useState<"summary" | "risk" | "obligations">("summary");
  
  const riskAssessor = data?.risk_assessor || { health_score: 0, risks: [] };
  const paralegal = data?.paralegal || { deadlines: [], financial_figures: [] };
  const negotiator = data?.negotiator || { counter_clauses: [] };

  const hasCriticalRisk = riskAssessor.risks.some((r: any) => r.severity === "CRITICAL");

  const totalValue = paralegal.financial_figures[0] || "N/A";
  const monthlyValue = paralegal.financial_figures[1] || "N/A";

  const obligations = paralegal.deadlines.map((d: string, idx: number) => {
    const [date, ...taskParts] = d.split(":");
    return {
      id: idx,
      deadline: date,
      task: taskParts.join(":").trim() || d,
      completed: false
    };
  });

  const getRedline = (clause: string) => {
    const match = negotiator.counter_clauses.find((c: any) => c.original_clause === clause);
    return match ? match.safe_harbor_redline : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-screen"
    >
      {/* Top Header */}
      <header className="h-16 border-b border-neutral-800 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Scale className="w-5 h-5 text-emerald-500" />
          <h1 className="font-semibold text-white truncate max-w-sm">
            {file?.name || "MSA_NexCorp_Final.pdf"}
          </h1>
          <span className="px-2 py-1 bg-neutral-800/80 text-neutral-400 text-xs rounded font-mono border border-neutral-700">
            ID: {id}
          </span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </header>

      {/* Critical Alert Banner */}
      <AnimatePresence>
        {hasCriticalRisk && activeTab !== "risk" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/10 border-b border-red-500/20 px-6 py-2.5 flex items-center justify-between shrink-0"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-200">
                CRITICAL risks detected by RiskAssessor Agent.
              </span>
            </div>
            <button
              onClick={() => setActiveTab("risk")}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
            >
              Review Risks &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Document Viewer (Dynamically Imported) */}
        <DocumentViewer />

        {/* Right Panel: Agent Insights */}
        <section className="w-1/2 flex flex-col bg-[#050505] relative overflow-hidden">
          {/* Glassmorphism gradient orb behind tabs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Tabs */}
          <div className="flex border-b border-neutral-800/80 shrink-0 bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-10">
            <TabButton
              active={activeTab === "summary"}
              onClick={() => setActiveTab("summary")}
              icon={<Activity className="w-4 h-4" />}
              label="Executive Summary"
            />
            <TabButton
              active={activeTab === "risk"}
              onClick={() => setActiveTab("risk")}
              icon={<ShieldAlert className="w-4 h-4" />}
              label="Risk Radar"
              hasAlert={hasCriticalRisk}
            />
            <TabButton
              active={activeTab === "obligations"}
              onClick={() => setActiveTab("obligations")}
              icon={<CheckSquare className="w-4 h-4" />}
              label="Obligations"
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8 relative z-0">
            {/* Using basic conditional rendering instead of AnimatePresence to reduce Framer Motion overhead on state updates */}
            {activeTab === "summary" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#0A0A0A] border border-neutral-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
                    <div className="text-sm text-neutral-400 mb-3 uppercase tracking-wider font-semibold">
                      Health Score
                    </div>
                    <div className="text-6xl font-bold text-orange-400 tracking-tighter drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                      {riskAssessor.health_score}
                      <span className="text-2xl text-neutral-600">/100</span>
                    </div>
                    <div className="mt-6 text-xs bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full border border-orange-500/20 font-medium">
                      High Risk Profile
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#0A0A0A] border border-neutral-800 p-6 rounded-2xl shadow-lg">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3">
                        Financials
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        {totalValue}
                      </div>
                      <div className="text-sm text-neutral-400 mt-1">
                        {monthlyValue}
                      </div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-neutral-800 p-6 rounded-2xl shadow-lg">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3">
                        Identified Parties
                      </div>
                      <div className="space-y-2">
                        {["GlobalTech Innovations (Client)", "NexCorp Solutions (Vendor)"].map((p) => (
                          <div key={p} className="text-sm text-neutral-200 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "risk" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {riskAssessor.risks.map((risk: any, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-6 rounded-2xl border transition-all",
                      risk.severity === "CRITICAL"
                        ? "bg-red-500/5 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]"
                        : "bg-[#0A0A0A] border-orange-500/20"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-white text-lg">{risk.clause}</h4>
                      <span
                        className={cn(
                          "text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider",
                          risk.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                        )}
                      >
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed mb-6">
                      {risk.explanation}
                    </p>

                    {risk.severity === "CRITICAL" && getRedline(risk.clause) && (
                      <div className="p-4 bg-black/50 rounded-xl border border-neutral-800">
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                          <Terminal className="w-3 h-3 text-emerald-500" />
                          Agent Negotiator Draft
                        </div>
                        <p className="text-sm text-emerald-400/90 font-mono">
                          "{getRedline(risk.clause)}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "obligations" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {obligations.map((ob: any) => (
                  <div
                    key={ob.id}
                    className="flex items-center gap-4 p-5 bg-[#0A0A0A] border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors group"
                  >
                    <button
                      className={cn(
                        "w-6 h-6 rounded flex items-center justify-center border transition-colors",
                        ob.completed
                          ? "bg-emerald-500 border-emerald-500 text-black"
                          : "border-neutral-600 group-hover:border-neutral-500 bg-neutral-900"
                      )}
                    >
                      {ob.completed && <CheckSquare className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <div
                        className={cn(
                          "font-medium",
                          ob.completed ? "text-neutral-500 line-through" : "text-neutral-200"
                        )}
                      >
                        {ob.task}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                      <Calendar className="w-3.5 h-3.5" />
                      {ob.deadline}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label, hasAlert }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all relative overflow-hidden",
        active ? "text-white bg-white/5" : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
      )}
    >
      {icon}
      {label}
      {hasAlert && !active && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse absolute top-4 right-4 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
      )}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_-2px_10px_rgba(16,185,129,0.5)]" />
      )}
    </button>
  );
}
