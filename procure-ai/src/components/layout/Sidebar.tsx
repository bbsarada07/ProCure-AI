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
  Layers,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-col h-screen w-64 border-r border-[#1E293B] bg-[#0F172A] text-white">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ProcureAI</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Gov Registry v1.0</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-6 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors",
                    isActive && "bg-slate-900 text-blue-400 border-l-2 border-blue-400 rounded-none font-semibold"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400")} />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-slate-900">
        <div className="flex items-center gap-3 px-2 py-3 bg-slate-900/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
            OS
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{t('officer_smith')}</p>
            <p className="text-xs text-slate-500 truncate">{t('crpf_division')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
