'use client';

import React from 'react';
import { Home, Search, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: AlertCircle, label: 'Alerts', href: '/alerts' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around px-6 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Icon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </footer>
  );
}
