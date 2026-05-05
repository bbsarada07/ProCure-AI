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
        className="w-full text-[10px] font-medium text-center text-slate-400 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 rounded-md px-2 py-1 outline-none transition-all placeholder:text-slate-300"
        placeholder="Enter IP (e.g. 192.168.1.15:3000)"
        title="Edit URL to your local Wi-Fi IP for mobile testing"
      />
    </div>
  );
}
