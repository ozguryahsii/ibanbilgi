import {
  FileSpreadsheet,
  Landmark,
  ScanSearch,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Tekil Sorgu",
    description: "IBAN'dan anında banka tespiti",
    icon: ScanSearch,
  },
  {
    href: "/toplu-sorgu",
    label: "Toplu Sorgu",
    description: "CSV ile yüzlerce IBAN'ı analiz edin",
    icon: FileSpreadsheet,
  },
  {
    href: "/bankalar",
    label: "Banka Rehberi",
    description: "Gömülü banka kodu referansı",
    icon: Landmark,
  },
  {
    href: "/gizlilik",
    label: "KVKK & Gizlilik",
    description: "Veriler cihazınızdan çıkmaz",
    icon: ShieldCheck,
  },
];
