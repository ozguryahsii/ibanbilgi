import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileSpreadsheet,
  ShieldCheck,
  Sigma,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { IbanLookup } from "@/components/dashboard/iban-lookup";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Tekil Sorgu" };

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "%100 Lokal Analiz",
    description:
      "IBAN'larınız hiçbir sunucuya gönderilmez; doğrulama ve banka tespiti tamamen tarayıcınızda çalışır.",
  },
  {
    icon: Sigma,
    title: "Mod-97 Doğrulama",
    description:
      "Her IBAN, ISO 13616 standardındaki kontrol basamağı algoritmasıyla matematiksel olarak doğrulanır.",
  },
  {
    icon: FileSpreadsheet,
    title: "Toplu CSV Analizi",
    description:
      "Yüzlerce IBAN'ı tek seferde işleyin; sonuçları grafiklerle inceleyin ve CSV olarak indirin.",
    href: "/toplu-sorgu",
  },
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl pb-10 pt-6 text-center sm:pt-12">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          IBAN&apos;dan{" "}
          <AnimatedGradientText>banka ve şubeyi</AnimatedGradientText>
          <br className="hidden sm:block" /> saniyeler içinde tespit edin
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          TR IBAN&apos;ını girin; geçerliliğini, ait olduğu bankayı ve tahmini şube
          kodunu anında görün. Verileriniz cihazınızdan asla çıkmaz.
        </p>
      </section>

      <section className="mx-auto max-w-3xl">
        <IbanLookup />
      </section>

      <section className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => {
          const inner = (
            <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
                {feature.title}
                {feature.href && (
                  <ArrowRight className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          );
          return feature.href ? (
            <Link key={feature.title} href={feature.href}>
              {inner}
            </Link>
          ) : (
            <div key={feature.title}>{inner}</div>
          );
        })}
      </section>
    </PageShell>
  );
}
