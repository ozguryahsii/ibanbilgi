import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { BulkAnalyzer } from "@/components/dashboard/bulk-analyzer";

export const metadata: Metadata = { title: "Toplu Sorgu" };

export default function BulkPage() {
  return (
    <PageShell>
      <PageHeader
        title="Toplu IBAN Analizi"
        description="CSV dosyanızı yükleyin; tüm IBAN'lar doğrulansın, banka dağılımı çıkarılsın ve sonuçlar tek tıkla indirilebilsin. Dosyanız hiçbir sunucuya yüklenmez."
      />
      <BulkAnalyzer />
    </PageShell>
  );
}
