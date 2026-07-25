"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Landmark, Lock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = NAV_ITEMS.find((i) => i.href === pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Menüyü aç"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-2">
            <Landmark className="size-4 text-white" />
          </div>
          <span className="text-sm font-semibold">IBAN Bilgi</span>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-sm font-semibold tracking-tight">
            {current?.label ?? "IBAN Bilgi"}
          </h1>
          <p className="text-xs text-muted-foreground">{current?.description}</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="success" className="hidden sm:inline-flex">
            <Lock />
            Veriler cihazınızda kalır
          </Badge>
          <ThemeToggle />
        </div>
      </div>

      {/* Üstteki header backdrop-blur nedeniyle fixed konum için containing
          block oluşturur; çekmece bu yüzden portal ile body'ye taşınır. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 bg-sidebar p-4 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold">IBAN Bilgi</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Menüyü kapat"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4.5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
