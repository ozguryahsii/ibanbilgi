"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Landmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 shadow-lg shadow-primary/30">
          <Landmark className="size-4.5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">IBAN Bilgi</div>
          <div className="text-[11px] text-muted-foreground">
            Banka & Şube Tespiti
          </div>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl border border-primary/25 bg-primary/10 shadow-[inset_0_1px_0_0] shadow-white/5"
                />
              )}
              <item.icon
                className={cn(
                  "relative size-4.5 shrink-0 transition-colors",
                  active ? "text-primary" : "group-hover:text-foreground"
                )}
              />
              <span className="relative flex flex-col leading-tight">
                {item.label}
                <span className="text-[11px] font-normal text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-success/25 bg-success/10 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-success">
          <ShieldCheck className="size-4" />
          %100 Lokal Analiz
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          IBAN&apos;larınız tarayıcınızdan çıkmaz; hiçbir sunucuya veya harici
          servise gönderilmez.
        </p>
      </div>
    </aside>
  );
}
