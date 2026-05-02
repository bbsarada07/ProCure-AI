'use client';

import { useState } from 'react';
import { compileTenderDNA } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function TenderUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [criteria, setCriteria] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setCriteria(null);
    try {
      const result = await compileTenderDNA(file);
      setCriteria(result);
      console.log('Compiled DNA:', result);
    } catch (error) {
      console.error('Extraction error:', error);
      showToast('DNA Compilation failed. Make sure the backend is running and the GFR Engine is active.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Initialize DNA Compiler</h2>
      
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400"
        >
          {loading ? 'Executing Logic-Gates via DNA Compiler...' : 'Compile Tender DNA'}
        </button>
      </div>

      {criteria && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-semibold mb-2 text-slate-900 flex items-center justify-between">
            Compiled DNA Ledger
            <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded-full border">
              Success
            </span>
          </h3>
          <pre className="text-xs overflow-auto bg-slate-900 text-slate-300 p-4 rounded-md shadow-inner max-h-[500px]">
            {JSON.stringify(criteria, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
