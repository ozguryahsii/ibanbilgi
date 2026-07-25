"use client";

import { motion } from "motion/react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Copy,
  GitBranch,
  Hash,
  Info,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BANK_TYPE_LABELS } from "@/lib/banks";
import { useBranchName } from "@/lib/branch-directory";
import { IbanResult } from "@/lib/iban";

function copyText(text: string, message: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(message))
    .catch(() => toast.error("Panoya kopyalanamadı."));
}

function Field({
  icon: Icon,
  label,
  children,
  tooltip,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background/40 p-3.5">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`${label} hakkında bilgi`}
                className="text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

/** Tekil sorgu sonucunu gösteren animasyonlu kart. */
export function ResultCard({ result }: { result: IbanResult }) {
  const branchName = useBranchName(result.bankCode, result.branchCodeGuess);
  if (!result.valid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="relative overflow-hidden border-destructive/30 p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent" />
          <div className="relative flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <XCircle className="size-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">Geçersiz IBAN</h3>
                <Badge variant="destructive">Doğrulama başarısız</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.errorMessage}
              </p>
              {result.normalized && (
                <p className="mt-3 break-all font-mono text-xs text-muted-foreground/80">
                  {result.formatted}
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  const bank = result.bank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="relative overflow-hidden p-6">
        <BorderBeam />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-chart-2 text-white shadow-lg shadow-primary/30">
                <Building2 className="size-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {bank ? bank.shortName : "Bilinmeyen Banka"}
                  </h3>
                  <Badge variant="success">
                    <CheckCircle2 />
                    Geçerli IBAN
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {bank
                    ? bank.name
                    : `${result.bankCode} kodu gömülü listede bulunamadı`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyText(result.normalized, "IBAN kopyalandı.")}
            >
              <Copy /> Kopyala
            </Button>
          </div>

          <p className="mt-5 break-all rounded-xl border border-border/50 bg-background/50 px-4 py-3 font-mono text-sm tracking-wide">
            {result.formatted}
          </p>

          <Separator className="my-5" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field icon={Hash} label="Banka Kodu">
              <span className="font-mono">{result.bankCode}</span>
            </Field>
            <Field icon={Building2} label="Banka Türü">
              {bank ? BANK_TYPE_LABELS[bank.type] : "—"}
            </Field>
            <Field icon={Hash} label="Kontrol Hanesi">
              <span className="font-mono">{result.checkDigits}</span>
            </Field>
            <Field
              icon={GitBranch}
              label="Şube (Tahmini)"
              tooltip={result.branchNote}
            >
              {result.branchCodeGuess ? (
                <span>
                  {branchName && <span>{branchName} </span>}
                  <span className="font-mono text-muted-foreground">
                    ({result.branchCodeGuess})
                  </span>
                  {!branchName && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      — ad dizinde yok
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground">Tespit edilemedi</span>
              )}
            </Field>
          </div>

          <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
            {result.branchNote}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
