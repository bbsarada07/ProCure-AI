'use client';

import { Search, Bell, HelpCircle, Languages, ChevronDown, UserCircle, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const languageMap: Record<Language, string> = {
  EN: 'English', HI: 'Hindi', BN: 'Bengali', TE: 'Telugu', MR: 'Marathi',
  TA: 'Tamil', GU: 'Gujarati', KN: 'Kannada', ML: 'Malayalam', PA: 'Punjabi'
};

export function TopNav() {
  const { role, setRole, language, setLanguage, t } = useAppContext();
  const { showToast } = useToast();

  return (
    /* IMPECCABLE: top bar stays in light mode — dark sidebar / light main area contrast */
    <header className="h-14 border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6 gap-4">

      {/* Search — functional, not decorative */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          id="topnav-search"
          placeholder="Search tenders, bidders, criteria…"
          className="pl-9 h-8 text-sm bg-muted/50 border-transparent rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-border"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Status pill — no pulsing animation on whole pill */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border",
            role === 'Evaluator'
              ? "bg-[oklch(0.97_0.03_72)] text-[oklch(0.52_0.14_72)] border-[oklch(0.88_0.06_72)]"
              : "bg-[oklch(0.96_0.03_148)] text-[oklch(0.40_0.14_148)] border-[oklch(0.84_0.06_148)]"
          )}
        >
          <span
            className="relative flex h-1.5 w-1.5 shrink-0"
            aria-hidden="true"
          >
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
                role === 'Evaluator' ? "bg-[oklch(0.72_0.16_72)]" : "bg-[oklch(0.56_0.16_148)]"
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-1.5 w-1.5",
                role === 'Evaluator' ? "bg-[oklch(0.72_0.16_72)]" : "bg-[oklch(0.56_0.16_148)]"
              )}
            />
          </span>
          {role === 'Evaluator' ? '1 action required' : '4 pending sign-offs'}
        </div>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            id="topnav-lang-trigger"
            className="outline-none"
          >
            <div
              role="button"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-muted/40
                         text-xs font-semibold text-muted-foreground uppercase tracking-wider
                         hover:bg-accent hover:text-accent-foreground transition-colors duration-150
                         focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Languages className="w-3.5 h-3.5" />
              {language}
              <ChevronDown className="w-3 h-3 opacity-50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 text-sm"
          >
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-1.5">
              Language
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {(Object.keys(languageMap) as Language[]).map((lang) => (
                <DropdownMenuItem
                  id={`lang-option-${lang.toLowerCase()}`}
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="gap-2 cursor-pointer text-xs"
                >
                  <Check
                    className={cn("w-3 h-3 shrink-0", language === lang ? "opacity-100" : "opacity-0")}
                  />
                  <span className={language === lang ? "font-semibold" : ""}>
                    {lang} — {languageMap[lang]}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger
            id="topnav-role-trigger"
            className="outline-none"
          >
            <div
              role="button"
              className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-muted/40
                         text-xs font-medium text-muted-foreground
                         hover:bg-accent hover:text-accent-foreground transition-colors duration-150
                         focus-visible:ring-2 focus-visible:ring-ring"
            >
              <UserCircle className="w-3.5 h-3.5" />
              <span>{role === 'Evaluator' ? t('junior_evaluator') : t('procurement_director')}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-1.5">
              {t('select_access')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {[
                { key: 'Evaluator', label: t('junior_evaluator'), sub: 'Maker — extraction & analysis' },
                { key: 'Director', label: t('procurement_director'), sub: 'Checker — final approval' },
              ].map(({ key, label, sub }) => (
                <DropdownMenuItem
                  id={`role-option-${key.toLowerCase()}`}
                  key={key}
                  onClick={() => setRole(key as any)}
                  className="gap-3 cursor-pointer py-2.5"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      role === key
                        ? key === 'Evaluator'
                          ? "bg-[oklch(0.72_0.16_72)]"
                          : "bg-[oklch(0.56_0.16_148)]"
                        : "bg-muted-foreground/30"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className={cn("text-xs", role === key ? "font-bold" : "font-medium")}>
                      {label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{sub}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Live sync indicator */}
        <div
          className="hidden lg:flex items-center gap-1.5 text-[oklch(0.56_0.16_148)]"
          aria-label="System status: Live sync active"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.56_0.16_148)] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[oklch(0.56_0.16_148)]" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest">Live</span>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Notification */}
        <Button
          id="topnav-notifications"
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => showToast("Notification Center: 2 new technical audits pending.", "info")}
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full"
            aria-hidden="true"
          />
        </Button>

        {/* Help */}
        <Button
          id="topnav-help"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => showToast("ProcureAI Support: Documentation initializing…", "info")}
          aria-label="Open help center"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
