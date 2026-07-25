import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { BankDirectory } from "@/components/dashboard/bank-directory";

export const metadata: Metadata = { title: "Banka Rehberi" };

export default function BanksPage() {
  return (
    <PageShell>
      <PageHeader
        title="Banka Rehberi"
        description="Uygulamaya gömülü TCMB banka kodu referansı. Sorgular bu liste üzerinden tamamen lokal çalışır; liste yeni sürümlerle güncellenir."
      />
      <BankDirectory />
    </PageShell>
  );
}
