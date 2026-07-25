"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { GitBranch, Inbox, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BANK_TYPE_LABELS, BANKS, BankType } from "@/lib/banks";

type TypeFilter = BankType | "all";

const TYPE_BADGE_VARIANTS: Record<BankType, "default" | "success" | "warning" | "secondary"> = {
  mevduat: "default",
  katilim: "success",
  "kalkinma-yatirim": "warning",
  diger: "secondary",
};

/** Gömülü banka kodu referansının aranabilir listesi. */
export function BankDirectory() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return BANKS.filter((bank) => {
      if (type !== "all" && bank.type !== type) return false;
      if (!q) return true;
      return [bank.code, bank.name, bank.shortName]
        .join(" ")
        .toLocaleLowerCase("tr")
        .includes(q);
    });
  }, [query, type]);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/50 p-4">
        <Tabs value={type} onValueChange={(v) => setType(v as TypeFilter)}>
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="all">Tümü ({BANKS.length})</TabsTrigger>
            <TabsTrigger value="mevduat">Mevduat</TabsTrigger>
            <TabsTrigger value="katilim">Katılım</TabsTrigger>
            <TabsTrigger value="kalkinma-yatirim">Kalkınma & Yatırım</TabsTrigger>
            <TabsTrigger value="diger">Diğer</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Banka adı veya kodu ara…"
            className="h-9 pl-9"
            aria-label="Banka ara"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <Inbox className="size-8 text-muted-foreground/60" />
          <p className="text-sm font-medium">Banka bulunamadı</p>
          <p className="text-xs text-muted-foreground">
            Farklı bir arama terimi veya filtre deneyin.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">Kod</TableHead>
              <TableHead>Banka</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead className="text-right">Şube Kalıbı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((bank, i) => (
              <motion.tr
                key={bank.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(i, 20) * 0.02 }}
                className="border-b border-border/50 transition-colors hover:bg-accent/40"
              >
                <TableCell className="font-mono text-xs text-primary">
                  {bank.code}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{bank.shortName}</div>
                  <div className="text-xs text-muted-foreground">
                    {bank.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={TYPE_BADGE_VARIANTS[bank.type]}>
                    {BANK_TYPE_LABELS[bank.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {bank.branchPattern ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1.5 text-xs text-success">
                          <GitBranch className="size-3.5" />
                          Biliniyor
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Hesap bölümünün ilk {bank.branchPattern.length} hanesi
                        tahmini şube kodu olarak okunur. Resmî bir IBAN alanı
                        değildir.
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
