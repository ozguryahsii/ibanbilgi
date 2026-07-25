"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Inbox, Search, XCircle } from "lucide-react";
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
import { BulkRow } from "@/lib/csv";
import { useBranchName } from "@/lib/branch-directory";

type Filter = "all" | "valid" | "invalid";

function BranchCell({
  bankCode,
  branchCode,
}: {
  bankCode?: string;
  branchCode?: string;
}) {
  const name = useBranchName(bankCode, branchCode);
  if (!branchCode) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="whitespace-nowrap">
      {name && <span>{name} </span>}
      <span className="font-mono text-muted-foreground">({branchCode})</span>
    </span>
  );
}

const PAGE_SIZE = 50;

/** Toplu sorgu sonuç tablosu: arama, geçerlilik filtresi ve sayfalama. */
export function ResultsTable({ rows }: { rows: BulkRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return rows.filter((row) => {
      if (filter === "valid" && !row.result.valid) return false;
      if (filter === "invalid" && row.result.valid) return false;
      if (!q) return true;
      const haystack = [
        row.result.normalized,
        row.label ?? "",
        row.result.bank?.name ?? "",
        row.result.bank?.shortName ?? "",
        row.result.bankCode ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase("tr");
      return haystack.includes(q);
    });
  }, [rows, filter, query]);

  const shown = filtered.slice(0, visible);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/50 p-4">
        <Tabs
          value={filter}
          onValueChange={(v) => {
            setFilter(v as Filter);
            setVisible(PAGE_SIZE);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="valid">
              <CheckCircle2 className="text-success" /> Geçerli
            </TabsTrigger>
            <TabsTrigger value="invalid">
              <XCircle className="text-destructive" /> Geçersiz
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="IBAN, banka veya etiket ara…"
            className="h-9 pl-9"
            aria-label="Sonuçlarda ara"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <Inbox className="size-8 text-muted-foreground/60" />
          <p className="text-sm font-medium">Sonuç bulunamadı</p>
          <p className="text-xs text-muted-foreground">
            Arama veya filtre ölçütlerinizi değiştirmeyi deneyin.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-14">#</TableHead>
              <TableHead>IBAN</TableHead>
              <TableHead>Etiket</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Banka</TableHead>
              <TableHead className="text-right">Şube (Tahmini)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((row, i) => (
              <motion.tr
                key={`${row.line}-${row.result.normalized}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(i, 20) * 0.015 }}
                className="border-b border-border/50 transition-colors hover:bg-accent/40"
              >
                <TableCell className="text-xs text-muted-foreground">
                  {row.line}
                </TableCell>
                <TableCell className="whitespace-nowrap font-mono text-xs">
                  {row.result.formatted || "—"}
                </TableCell>
                <TableCell className="max-w-40 truncate text-xs text-muted-foreground">
                  {row.label ?? "—"}
                </TableCell>
                <TableCell>
                  {row.result.valid ? (
                    <Badge variant="success">
                      <CheckCircle2 /> Geçerli
                    </Badge>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Badge variant="destructive">
                            <XCircle /> Geçersiz
                          </Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{row.result.errorMessage}</TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {row.result.valid ? (
                    row.result.bank ? (
                      <span className="font-medium">
                        {row.result.bank.shortName}
                        <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                          {row.result.bankCode}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Bilinmeyen ({row.result.bankCode})
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-xs">
                  <BranchCell
                    bankCode={row.result.bankCode}
                    branchCode={row.result.branchCodeGuess}
                  />
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      )}

      {filtered.length > visible && (
        <div className="flex items-center justify-center border-t border-border/50 p-3">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-lg px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Daha fazla göster ({filtered.length - visible} kayıt kaldı)
          </button>
        </div>
      )}
    </Card>
  );
}
