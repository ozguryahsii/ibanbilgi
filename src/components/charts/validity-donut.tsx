"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";
import { ChartTooltip } from "./chart-tooltip";

interface ValidityDonutProps {
  valid: number;
  invalid: number;
}

/**
 * Geçerli/geçersiz dağılımı — durum renkleri kullanılır ve renk asla tek
 * başına bırakılmaz: ikonlu açıklama + doğrudan sayılar eşlik eder.
 */
export function ValidityDonut({ valid, invalid }: ValidityDonutProps) {
  const total = valid + invalid;
  const data = [
    { name: "Geçerli", value: valid, fill: "var(--success)" },
    { name: "Geçersiz", value: invalid, fill: "var(--destructive)" },
  ].filter((d) => d.value > 0);

  const pct = total > 0 ? Math.round((valid / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
      <div className="relative h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={3}
              strokeWidth={2}
              stroke="var(--card)"
              cornerRadius={4}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums">%{pct}</span>
          <span className="text-[11px] text-muted-foreground">geçerli</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-success" />
          <span className="text-muted-foreground">Geçerli</span>
          <span className="ml-auto font-semibold tabular-nums">
            {Intl.NumberFormat("tr-TR").format(valid)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="size-4 text-destructive" />
          <span className="text-muted-foreground">Geçersiz</span>
          <span className="ml-auto font-semibold tabular-nums">
            {Intl.NumberFormat("tr-TR").format(invalid)}
          </span>
        </div>
      </div>
    </div>
  );
}
