"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  ListChecks,
  RotateCcw,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BankDistributionChart } from "@/components/charts/bank-distribution-chart";
import { ValidityDonut } from "@/components/charts/validity-donut";
import {
  BulkRow,
  BulkSummary,
  buildResultsCsv,
  downloadTextFile,
  parseBulkCsv,
  SAMPLE_CSV,
  summarizeBulk,
} from "@/lib/csv";
import { loadDirectory, lookupBranchName } from "@/lib/branch-directory";
import { cn } from "@/lib/utils";
import { KpiCard } from "./kpi-card";
import { ResultsTable } from "./results-table";

type Phase =
  | { name: "idle" }
  | { name: "processing"; fileName: string }
  | { name: "error"; message: string }
  | { name: "done"; fileName: string; rows: BulkRow[]; summary: BulkSummary };

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ProcessingState({ fileName }: { fileName: string }) {
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4 p-5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <FileText className="size-5 animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-medium">{fileName} işleniyor…</p>
          <p className="text-xs text-muted-foreground">
            Tüm analiz tarayıcınızda gerçekleşiyor; dosyanız yüklenmiyor.
          </p>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

/** CSV yükleme, analiz, KPI/grafik ve sonuç indirme akışının tamamı. */
export function BulkAnalyzer() {
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setPhase({
        name: "error",
        message: `"${file.name}" desteklenmiyor. Lütfen .csv (veya .txt) uzantılı bir dosya yükleyin.`,
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setPhase({
        name: "error",
        message: "Dosya 5 MB sınırını aşıyor. Lütfen daha küçük parçalara bölün.",
      });
      return;
    }

    setPhase({ name: "processing", fileName: file.name });
    const reader = new FileReader();
    reader.onerror = () =>
      setPhase({ name: "error", message: "Dosya okunamadı. Tekrar deneyin." });
    reader.onload = () => {
      // Kısa gecikme, iskelet durumunun algılanabilmesi için eklenir.
      setTimeout(() => {
        try {
          const rows = parseBulkCsv(String(reader.result ?? ""));
          if (rows.length === 0) {
            setPhase({
              name: "error",
              message:
                "Dosyada işlenecek satır bulunamadı. Örnek şablonu indirip formatı kontrol edin.",
            });
            return;
          }
          setPhase({
            name: "done",
            fileName: file.name,
            rows,
            summary: summarizeBulk(rows),
          });
          toast.success(`${rows.length} satır analiz edildi.`);
        } catch {
          setPhase({
            name: "error",
            message: "CSV çözümlenirken bir hata oluştu. Dosya formatını kontrol edin.",
          });
        }
      }, 600);
    };
    reader.readAsText(file, "utf-8");
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const downloadSample = () => {
    downloadTextFile("iban-ornek-sablon.csv", SAMPLE_CSV);
    toast.success("Örnek şablon indirildi.");
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {phase.name === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label="CSV dosyası yükle"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
                dragging
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-border/70 bg-card/40 hover:border-primary/50 hover:bg-accent/30"
              )}
            >
              {dragging && <BorderBeam duration={4} />}
              <motion.div
                animate={{ y: dragging ? -6 : 0 }}
                className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-chart-2 text-white shadow-xl shadow-primary/30"
              >
                <UploadCloud className="size-7" />
              </motion.div>
              <div>
                <p className="text-base font-semibold">
                  CSV dosyanızı buraya bırakın
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  veya{" "}
                  <span className="font-medium text-primary">
                    tıklayarak seçin
                  </span>{" "}
                  · en fazla 5 MB · IBAN&apos;lar cihazınızdan çıkmaz
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Beklenen format:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                  IBAN;Etiket
                </code>{" "}
                başlıklı noktalı virgül veya virgül ayraçlı CSV. Etiket kolonu
                isteğe bağlıdır.
              </p>
              <Button variant="outline" size="sm" onClick={downloadSample}>
                <Download /> Örnek şablonu indir
              </Button>
            </div>
          </motion.div>
        )}

        {phase.name === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingState fileName={phase.fileName} />
          </motion.div>
        )}

        {phase.name === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-destructive/30 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
                <AlertTriangle className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold">Dosya işlenemedi</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                {phase.message}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button onClick={() => setPhase({ name: "idle" })}>
                  <RotateCcw /> Tekrar dene
                </Button>
                <Button variant="outline" onClick={downloadSample}>
                  <Download /> Örnek şablonu indir
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {phase.name === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{phase.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {phase.summary.total} satır işlendi
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhase({ name: "idle" })}
                >
                  <RotateCcw /> Yeni dosya
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    const directory = await loadDirectory();
                    downloadTextFile(
                      "iban-sonuclari.csv",
                      buildResultsCsv(phase.rows, (bank, sube) =>
                        lookupBranchName(directory, bank, sube)
                      )
                    );
                    toast.success("Sonuç dosyası indirildi.");
                  }}
                >
                  <Download /> Sonuçları CSV indir
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                title="Toplam Kayıt"
                value={phase.summary.total}
                icon={ListChecks}
                tone="primary"
                index={0}
              />
              <KpiCard
                title="Geçerli IBAN"
                value={phase.summary.valid}
                icon={CheckCircle2}
                tone="success"
                hint={
                  phase.summary.total > 0
                    ? `%${Math.round((phase.summary.valid / phase.summary.total) * 100)} başarı oranı`
                    : undefined
                }
                index={1}
              />
              <KpiCard
                title="Geçersiz IBAN"
                value={phase.summary.invalid}
                icon={XCircle}
                tone="destructive"
                index={2}
              />
              <KpiCard
                title="Farklı Banka"
                value={phase.summary.bankCount}
                icon={Building2}
                tone="neutral"
                index={3}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Banka Dağılımı</CardTitle>
                  <CardDescription>
                    Geçerli IBAN&apos;ların bankalara göre dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {phase.summary.byBank.length > 0 ? (
                    <BankDistributionChart data={phase.summary.byBank} />
                  ) : (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      Geçerli IBAN bulunmadığı için dağılım oluşturulamadı.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Doğrulama Özeti</CardTitle>
                  <CardDescription>
                    Mod-97 ve format kontrolü sonuçları
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex min-h-52 items-center justify-center">
                  <ValidityDonut
                    valid={phase.summary.valid}
                    invalid={phase.summary.invalid}
                  />
                </CardContent>
              </Card>
            </div>

            <ResultsTable rows={phase.rows} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
