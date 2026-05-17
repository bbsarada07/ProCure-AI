"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, CheckCircle, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContractUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setAgentLogs([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Create a mock SSE connection for demonstration
      // In production, this would be a real fetch with stream reading
      // Because we can't easily do fetch EventSource with POST, we will mock the stream or use fetch readable stream.

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/v2/saas-analyzer/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.replace("data: ", ""));
                setAgentLogs((prev) => [...prev, data]);
                if (data.status === "done") {
                  setTimeout(() => {
                    // Redirect to final report
                    router.push('/contract-analysis/test-doc-id');
                  }, 1500);
                }
              } catch (e) {
                console.error("Error parsing SSE:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error uploading:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold mb-3 tracking-tight">SaaS Contract Analyzer</h1>
          <p className="text-neutral-400">Automate contract review with our 4-agent legal pipeline.</p>
        </div>

        {!isProcessing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700'}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <UploadCloud className={`w-16 h-16 mb-6 ${isDragActive ? 'text-emerald-500' : 'text-neutral-500'}`} />
              <h3 className="text-xl font-medium mb-2">
                {isDragActive ? "Drop contract here" : "Drag & drop your contract"}
              </h3>
              <p className="text-neutral-500 mb-6 text-sm">Supports PDF, DOCX (Max 20MB)</p>

              {file && (
                <div className="flex items-center gap-3 bg-neutral-800 px-4 py-2 rounded-lg text-sm text-neutral-300">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  {file.name}
                </div>
              )}

              {!file && (
                <button className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Browse Files
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <AgentStatusConsole logs={agentLogs} />
        )}

        {file && !isProcessing && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpload}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              Analyze Contract <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentStatusConsole({ logs }: { logs: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6 shadow-2xl font-mono"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Agent Pipeline Execution</div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4"
            >
              <div className="mt-1">
                {log.status === "processing" && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                {log.status === "complete" && <CheckCircle className="w-4 h-4 text-neutral-500" />}
                {log.status === "done" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${log.status === 'processing' ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    [{log.agent}]
                  </span>
                  <span className="text-neutral-500 text-xs">{new Date().toLocaleTimeString()}</span>
                </div>
                <p className={`text-sm mt-1 ${log.status === 'processing' ? 'text-neutral-200' : 'text-neutral-400'}`}>
                  {log.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length > 0 && logs[logs.length - 1].status !== "done" && (
          <div className="flex items-center gap-3 mt-4 text-emerald-500/50 animate-pulse">
            <span className="w-2 h-4 bg-emerald-500/50 inline-block"></span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
