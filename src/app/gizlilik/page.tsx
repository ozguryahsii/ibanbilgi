import type { Metadata } from "next";
import {
  CloudOff,
  Cpu,
  Database,
  EyeOff,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "KVKK & Gizlilik" };

const PRINCIPLES = [
  {
    icon: Cpu,
    title: "Tamamen Lokal İşleme",
    description:
      "IBAN doğrulama (mod-97), banka tespiti ve şube tahmini dahil tüm analizler tarayıcınızın içinde çalışır. Sorguladığınız hiçbir IBAN, ağ üzerinden herhangi bir sunucuya iletilmez.",
  },
  {
    icon: CloudOff,
    title: "Dosyalar Yüklenmez",
    description:
      "Toplu sorguda seçtiğiniz CSV dosyası yalnızca tarayıcı belleğinde okunur. Dosya bir sunucuya yüklenmez, sayfayı kapattığınızda içerik bellekten silinir.",
  },
  {
    icon: Database,
    title: "Kayıt Tutulmaz",
    description:
      "Uygulama; sorgulanan IBAN'ları, yüklenen dosyaları veya sonuçları hiçbir yerde saklamaz. Çerezle ya da başka bir yöntemle sorgu geçmişi oluşturulmaz.",
  },
  {
    icon: EyeOff,
    title: "Üçüncü Taraf Yok",
    description:
      "Sayfalarda analitik, reklam veya izleme amaçlı üçüncü taraf betiği bulunmaz. Kişisel verileriniz hiçbir üçüncü tarafla paylaşılmaz.",
  },
  {
    icon: RefreshCcw,
    title: "Referans Veri Güncellemesi",
    description:
      "Banka kodu listesi uygulamaya gömülüdür ve yalnızca uygulama güncellemeleriyle yenilenir. Güncelleme sürecinde de IBAN veya kullanıcı verisi aktarılmaz; yalnızca kamuya açık banka kodu referansı taşınır.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader
        title="KVKK & Gizlilik Yaklaşımı"
        description="Bu uygulama, kişisel veri niteliği taşıyabilecek IBAN'ların korunmasını mimari bir ilke olarak benimser: veriler işlenmek için bile cihazınızdan çıkmaz."
      >
        <Badge variant="success" className="px-3 py-1">
          <ShieldCheck />
          Veri dışarı çıkmaz
        </Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((item) => (
          <Card
            key={item.title}
            className="group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
          >
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                <item.icon className="size-5" />
              </div>
              <CardTitle className="text-sm">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-warning/25 bg-warning/5">
        <CardContent className="p-5 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Not:</strong> Şube kodu, TR IBAN
          standardında resmî bir alan olmadığından yalnızca bankaya özgü bilinen
          yerleşim kalıplarına göre <em>tahmini</em> olarak gösterilir. Kesin
          şube bilgisi için ilgili bankanın kayıtları esas alınmalıdır.
        </CardContent>
      </Card>
    </PageShell>
  );
}
