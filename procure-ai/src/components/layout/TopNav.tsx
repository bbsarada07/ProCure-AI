'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppContext, Language } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, UserCircle, ShieldAlert, Languages, Check } from 'lucide-react';

const languageMap: Record<Language, string> = {
  EN: 'English',
  HI: 'Hindi',
  BN: 'Bengali',
  TE: 'Telugu',
  MR: 'Marathi',
  TA: 'Tamil',
  GU: 'Gujarati',
  KN: 'Kannada',
  ML: 'Malayalam',
  PA: 'Punjabi'
};

export function TopNav() {
  const { role, setRole, language, setLanguage, t } = useAppContext();
  const { showToast } = useToast();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="h-16 border-b border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
          <Input 
            placeholder="Search tenders, bidders, or criteria..." 
            className="pl-10 bg-[#1E293B] border-transparent text-white placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-full h-9 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full border animate-pulse transition-colors",
          role === 'Evaluator' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
        )}>
          <div className={cn("w-2 h-2 rounded-full", role === 'Evaluator' ? "bg-amber-500" : "bg-emerald-500")} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {role === 'Evaluator' ? '1 Action Required' : '4 Pending Sign-offs'}
          </span>
        </div>
        
        {/* Localization Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div 
              role="button"
              className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[#1E293B] text-xs font-bold whitespace-nowrap transition-all outline-none select-none active:scale-[0.98] cursor-pointer text-slate-300 gap-2 px-3 h-9 hover:bg-slate-800 hover:text-white uppercase tracking-widest min-w-[70px]"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              {language}
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#1E293B] border-slate-700 text-slate-200">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-slate-500 text-[9px] uppercase tracking-widest px-3 py-2">Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
            </DropdownMenuGroup>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {(Object.keys(languageMap) as Language[]).map((lang) => (
                <DropdownMenuItem 
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)} 
                  className="gap-2 focus:bg-slate-800 cursor-pointer px-3 py-2"
                >
                  <span className={cn("flex-1 text-xs", language === lang ? "font-bold text-white" : "text-slate-400")}>
                    {lang} - {languageMap[lang]}
                  </span>
                  {language === lang && <Check className="w-3 h-3 text-blue-400" />}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div 
              role="button"
              className={cn(
                "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[#1E293B] text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] cursor-pointer text-slate-300 gap-2 px-3 h-9 hover:bg-slate-800 hover:text-white"
              )}
            >
              <UserCircle className="w-4 h-4" />
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-slate-500 leading-none mb-0.5">{t('current_role')}</div>
                <div className="text-[11px] font-bold leading-none">{role === 'Evaluator' ? t('junior_evaluator') : t('procurement_director')}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1E293B] border-slate-700 text-slate-200">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-slate-500 text-[10px] uppercase tracking-widest px-3 py-2">{t('select_access')}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={() => setRole('Evaluator')}
                className="gap-3 focus:bg-slate-800 focus:text-white cursor-pointer group py-3 px-4"
              >
                <div className={cn("w-3 h-3 rounded-full shrink-0", role === 'Evaluator' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-transparent border-2 border-slate-600")} />
                <div className="flex flex-col">
                  <span className={cn("text-sm transition-colors", role === 'Evaluator' ? "font-black text-white" : "font-bold text-slate-200 group-hover:text-white")}>{t('junior_evaluator')}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Role: Maker (Extraction & Analysis)</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setRole('Director')}
                className="gap-3 focus:bg-slate-800 focus:text-white cursor-pointer group py-3 px-4"
              >
                <div className={cn("w-3 h-3 rounded-full shrink-0", role === 'Director' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-transparent border-2 border-slate-600")} />
                <div className="flex flex-col">
                  <span className={cn("text-sm transition-colors", role === 'Director' ? "font-black text-white" : "font-bold text-slate-200 group-hover:text-white")}>{t('procurement_director')}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Role: Checker (Final Approval)</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#1E293B] border border-slate-700 rounded-lg text-slate-300">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Sync Active</span>
        </div>

        <div className="h-8 w-px bg-slate-700 mx-2" />

        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-slate-400 hover:text-white hover:bg-[#1E293B]"
          onClick={() => showToast("Notification Center: 2 new technical audits pending.", "info")}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-white hover:bg-[#1E293B]"
          onClick={() => showToast("ProcureAI Support: Documentation and help center initializing...", "info")}
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
