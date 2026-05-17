'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  History,
  Settings,
  ShieldCheck,
  Sparkles,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/context/AppContext';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useAppContext();

  const navItems = [
    { name: t('nav_dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav_criteria_setup'), href: '/tender/crpf-2026/criteria', icon: FileText },
    { name: t('nav_evaluation_matrix'), href: '/tender/crpf-2026/evaluation', icon: Users },
    { name: t('nav_rti_management'), href: '/tender/crpf-2026/rti', icon: Mail },
    { name: t('nav_draft_analyzer'), href: '/tender/crpf-2026/draft-analyzer', icon: Sparkles },
    { name: t('nav_audit_trail'), href: '/tender/crpf-2026/audit', icon: History },
    { name: t('nav_settings'), href: '/settings', icon: Settings },
  ];

  return (
    /* IMPECCABLE: No pure black — tinted indigo-navy */
    <div className="flex flex-col h-screen w-60 bg-[oklch(0.135_0.025_263)] border-r border-[oklch(0.22_0.03_263)]">

      {/* Wordmark — tight, no decorative icon tile */}
      <div className="px-5 py-6 flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[oklch(0.68_0.14_263)] shrink-0" />
        <div>
          <span className="text-[oklch(0.94_0.008_255)] text-base font-bold tracking-tight">
            ProcureAI
          </span>
          <span className="block text-[oklch(0.55_0.02_263)] text-[10px] uppercase tracking-widest font-medium mt-0.5">
            Gov Registry
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[oklch(0.22_0.03_263)]" />

      {/* Navigation — IMPECCABLE: active state uses background, not a left-border stripe */}
      <ScrollArea className="flex-1 py-4 px-3">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`sidebar-nav-${item.href.replace(/\//g, '-').slice(1)}`}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[oklch(0.46_0.16_263)] text-[oklch(0.97_0.005_255)]'
                    : 'text-[oklch(0.65_0.022_263)] hover:bg-[oklch(0.20_0.030_263)] hover:text-[oklch(0.88_0.010_255)]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-[oklch(0.84_0.10_263)]' : 'text-[oklch(0.52_0.03_263)] group-hover:text-[oklch(0.72_0.04_263)]'
                  )}
                />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[oklch(0.75_0.08_263)] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section divider with label */}
        <div className="mt-6 mb-2 px-3">
          <span className="text-[oklch(0.42_0.02_263)] text-[10px] uppercase tracking-widest font-semibold">
            Contract Crew
          </span>
        </div>
        <Link
          href="/contract-crew/session-1"
          id="sidebar-nav-contract-crew"
          className={cn(
            'group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
            pathname.startsWith('/contract-crew')
              ? 'bg-[oklch(0.46_0.16_263)] text-[oklch(0.97_0.005_255)]'
              : 'text-[oklch(0.65_0.022_263)] hover:bg-[oklch(0.20_0.030_263)] hover:text-[oklch(0.88_0.010_255)]'
          )}
        >
          <Sparkles className="w-4 h-4 shrink-0 text-[oklch(0.72_0.14_72)]" />
          <span>AI Contract Analyzer</span>
        </Link>
      </ScrollArea>

      {/* User identity — compact, no card nesting */}
      <div className="px-4 py-4 border-t border-[oklch(0.22_0.03_263)]">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-full bg-[oklch(0.35_0.08_263)] flex items-center justify-center text-[10px] font-bold text-[oklch(0.80_0.10_263)] shrink-0"
            aria-label="User avatar"
          >
            OS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[oklch(0.88_0.010_255)] truncate">
              {t('officer_smith')}
            </p>
            <p className="text-xs text-[oklch(0.50_0.02_263)] truncate">{t('crpf_division')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
