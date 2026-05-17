'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  UploadCloud,
  FileCheck,
  Loader2,
  Plus,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { compileTenderDNA } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

const STATS = [
  {
    label: 'total_bidders',
    value: '10',
    sub: 'Registered applicants',
    icon: Users,
    hue: '263',
  },
  {
    label: 'cleared',
    value: '7',
    sub: 'Passed all criteria',
    icon: CheckCircle2,
    hue: '148',
  },
  {
    label: 'rejected',
    value: '3',
    sub: 'Failed logic-gate',
    icon: XCircle,
    hue: '28',
  },
];

export default function DashboardPage() {
  const { t } = useAppContext();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await compileTenderDNA(file);
      setExtractedData(result);
    } catch {
      showToast('Failed to process tender. Check backend connection.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    /* IMPECCABLE: Page enter animation with ease-expo */
    <div className="page-enter space-y-10 max-w-[1400px]">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Programme Overview
          </p>
          <h1 className="text-2xl font-bold tracking-tight">{t('program_dashboard')}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/analytics">
            <Button
              id="btn-view-analytics"
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground"
            >
              <TrendingUp className="w-4 h-4" />
              {t('analytics')}
            </Button>
          </Link>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              nativeButton={true}
              render={
                <Button
                  id="btn-new-tender"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('new_tender')}
                </Button>
              }
            />

            {/* Upload dialog — IMPECCABLE: clear steps, no decorative chrome */}
            <DialogContent
              id="dialog-new-tender"
              className="sm:max-w-[520px] border-border"
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Initialize Tender DNA Compiler
                </DialogTitle>
                <DialogDescription>
                  Upload the official tender document to begin AI-powered extraction.
                </DialogDescription>
              </DialogHeader>

              {!extractedData ? (
                <div className="space-y-5 py-2">
                  {/* Drop zone — no icon-tile-above-heading */}
                  <button
                    id="dropzone-tender-upload"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="dropzone w-full"
                    aria-label="Click to upload a tender document"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                      aria-label="Tender file input"
                    />
                    <UploadCloud
                      className="w-8 h-8 text-muted-foreground mb-4"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm font-semibold text-foreground">
                      {file ? file.name : 'Click to select document'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF or Word, up to 50 MB
                    </p>
                  </button>

                  <DialogFooter className="flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      Engine: Llama 3.3 via Groq
                    </span>
                    <Button
                      id="btn-start-dna-compile"
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      size="sm"
                      className="min-w-[160px] gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Compiling DNA…
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4" />
                          Start Compilation
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4 page-enter">
                  {/* Success state — no green-on-green */}
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 shrink-0"
                      style={{ color: 'var(--success)' }}
                    />
                    <div>
                      <p className="text-sm font-semibold">DNA Compilation Complete</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Logic-gates compiled multidimensional criteria from the document.
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[260px] overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                    <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
                  </div>

                  <DialogFooter>
                    <Link href="/tender/crpf-2026/criteria" className="w-full">
                      <Button id="btn-view-ledger" className="w-full gap-2" size="sm">
                        View Immutable Ledger
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Stat cluster — IMPECCABLE: not identical icon-card grid ── */}
      <div className="stat-cluster grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="stat-item group">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{t(s.label)}</span>
              <s.icon
                className="w-4 h-4"
                style={{ color: `oklch(0.56 0.16 ${s.hue})` }}
              />
            </div>
            <span
              className="stat-value"
              style={{ color: `oklch(0.22 0.04 ${s.hue === '263' ? '263' : s.hue})` }}
            >
              {s.value}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Main grid — IMPECCABLE: asymmetric rhythm, not 3×identical cards ── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Active tenders — wider column */}
        <div className="lg:col-span-3">
          <div className="section-header">
            <h2 className="section-title">{t('active_tenders')}</h2>
            <Badge
              variant="outline"
              className="text-xs font-semibold text-primary border-primary/30 bg-primary/8"
            >
              1 Active
            </Badge>
          </div>

          {/* IMPECCABLE: surface-row instead of nested card-in-card */}
          <div className="surface-row flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'oklch(0.93 0.012 263)' }}
              >
                <FileText className="w-4 h-4" style={{ color: 'oklch(0.46 0.16 263)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  CRPF Construction Services 2026
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID: CRPF-CS-2026-004 · Updated 2h ago
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              {/* Progress bar with label */}
              <div className="hidden sm:flex flex-col items-end gap-1.5">
                <span className="text-xs font-semibold tabular-nums">60%</span>
                <div className="w-28 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '60%',
                      background: 'oklch(0.46 0.16 263)',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>

              <Link href="/tender/crpf-2026/evaluation">
                <Button
                  id="btn-view-evaluation"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-primary"
                >
                  {t('view')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Empty state hint */}
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            More tenders appear here after DNA compilation.
          </p>
        </div>

        {/* Statutory agent panel — darker surface, no nested cards */}
        <div
          className="lg:col-span-2 rounded-xl p-6 flex flex-col gap-5 relative overflow-hidden"
          style={{ background: 'oklch(0.135 0.025 263)' }}
        >
          {/* Decorative emblem — subtle, not a card */}
          <ShieldCheck
            className="absolute -bottom-4 -right-4 w-28 h-28 opacity-[0.06]"
            style={{ color: 'oklch(0.68 0.14 263)' }}
          />

          <div>
            <h2 className="text-sm font-bold text-[oklch(0.88_0.010_255)]">
              {t('statutory_agent')}
            </h2>
            <p className="text-xs text-[oklch(0.52_0.02_263)] mt-0.5">
              {t('powered_by_gfr')}
            </p>
          </div>

          <p className="text-sm text-[oklch(0.72_0.018_263)] leading-relaxed" style={{ maxWidth: '52ch' }}>
            {t('agent_summary')}
          </p>

          <div className="space-y-2 mt-auto">
            <Link href="/tender/crpf-2026/evaluation">
              <button
                id="btn-view-matrix"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
                           bg-[oklch(0.46_0.16_263)] text-[oklch(0.97_0.005_255)] text-sm font-semibold
                           hover:opacity-90 transition-opacity duration-150"
              >
                <FileText className="w-4 h-4" />
                View Evaluation Matrix
              </button>
            </Link>
            <Link href="/tender/crpf-2026/evaluation">
              <button
                id="btn-gen-audit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md
                           text-[oklch(0.52_0.02_263)] text-sm font-medium
                           hover:bg-[oklch(0.20_0.03_263)] hover:text-[oklch(0.78_0.02_263)]
                           transition-all duration-150"
              >
                {t('gen_audit_report')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
