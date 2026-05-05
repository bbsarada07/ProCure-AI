'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function MobileSyncQR() {
  const [qrUrl, setQrUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(window.location.href);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm gap-3 mt-4 mx-4">
      {qrUrl.includes('localhost') && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-1 w-full">
          <p className="text-[10px] font-bold text-amber-800 leading-snug">
            ⚠️ Mobile Scan Disabled:<br/>
            <span className="font-medium text-amber-700">You are on localhost. Enter Wi-Fi IP below.</span>
          </p>
        </div>
      )}

      <div className="p-2 bg-white rounded-xl shadow-inner border border-slate-50">
        <QRCode value={qrUrl || 'http://localhost:3000'} size={120} level="H" />
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center max-w-[140px]">
        Scan to Open on Mobile
      </p>
      
      <input
        type="text"
        value={qrUrl}
        onChange={(e) => setQrUrl(e.target.value)}
        className="w-full text-xs font-bold text-center text-slate-700 bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-md px-2 py-1.5 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
        placeholder="e.g., http://192.168.1.5:3000"
        title="Edit URL to your local Wi-Fi IP for mobile testing"
      />
    </div>
  );
}
