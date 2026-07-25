"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClipboardPaste, ScanSearch, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { formatIban, IbanResult, normalizeIban, parseIban } from "@/lib/iban";
import { ResultCard } from "./result-card";

function ResultSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="size-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>
      <Skeleton className="mt-5 h-11 w-full" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[74px]" />
        ))}
      </div>
    </Card>
  );
}

/** Tekil IBAN sorgu modülü: giriş alanı, analiz animasyonu ve sonuç kartı. */
export function IbanLookup() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<IbanResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runLookup = (raw: string) => {
    if (!raw.trim()) {
      toast.warning("Önce bir IBAN girin.");
      return;
    }
    // Sonuç anlık hesaplanır; kısa bekleme yalnızca analiz hissi içindir.
    setAnalyzing(true);
    setResult(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setResult(parseIban(raw));
      setAnalyzing(false);
    }, 450);
  };

  const handleChange = (raw: string) => {
    const normalized = normalizeIban(raw);
    setValue(normalized.length > 2 ? formatIban(normalized) : raw.toUpperCase());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        toast.warning("Panoda metin bulunamadı.");
        return;
      }
      handleChange(text);
      runLookup(text);
    } catch {
      toast.error("Panoya erişilemedi. IBAN'ı elle yapıştırabilirsiniz.");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runLookup(value);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <ScanSearch className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="TR__ ____ ____ ____ ____ ____ __"
            spellCheck={false}
            autoComplete="off"
            maxLength={32}
            aria-label="IBAN"
            className="h-13 pl-11 pr-12 font-mono text-base tracking-wider"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Panodan yapıştır ve sorgula"
            title="Panodan yapıştır"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <ClipboardPaste className="size-4" />
          </Button>
        </div>
        <ShimmerButton type="submit" disabled={analyzing} className="h-13">
          <Sparkles />
          {analyzing ? "Analiz ediliyor…" : "Sorgula"}
        </ShimmerButton>
      </form>

      <AnimatePresence mode="wait">
        {analyzing && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ResultSkeleton />
          </motion.div>
        )}
        {!analyzing && result && (
          <motion.div key={result.normalized} exit={{ opacity: 0, y: -8 }}>
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
