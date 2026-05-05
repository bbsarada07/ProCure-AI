'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function MobileSyncQR() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Grab the current window URL
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin + '/dashboard');
    }
  }, []);

  if (!url) return null;

  return (
    <div className="hidden md:flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm gap-2 mt-4 mx-4">
      <div className="p-2 bg-white rounded-xl shadow-inner border border-slate-50">
        <QRCode value={url} size={120} level="H" />
      </div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center max-w-[140px]">
        Scan to Open Bidder Portal on Mobile
      </p>
    </div>
  );
}
