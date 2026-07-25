"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./chart-tooltip";

interface BankDistributionChartProps {
  data: { name: string; count: number }[];
  maxBars?: number;
}

/**
 * Banka dağılımı — tek serili yatay bar grafik.
 * Tek ölçü olduğu için tek renk kullanılır; kimlik eksende taşınır.
 */
export function BankDistributionChart({
  data,
  maxBars = 8,
}: BankDistributionChartProps) {
  const top = data.slice(0, maxBars);
  const rest = data.slice(maxBars);
  const chartData =
    rest.length > 0
      ? [
          ...top,
          { name: "Diğer", count: rest.reduce((s, d) => s + d.count, 0) },
        ]
      : top;

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 40)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 36, bottom: 4, left: 8 }}
        barCategoryGap="28%"
      >
        <CartesianGrid
          horizontal={false}
          stroke="var(--border)"
          strokeOpacity={0.5}
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--accent)", opacity: 0.4 }}
          content={<ChartTooltip />}
        />
        <Bar
          dataKey="count"
          name="IBAN sayısı"
          radius={[0, 4, 4, 0]}
          maxBarSize={18}
          label={{
            position: "right",
            fill: "var(--foreground)",
            fontSize: 11,
            formatter: (v: React.ReactNode) =>
              Intl.NumberFormat("tr-TR").format(Number(v)),
          }}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.name === "Diğer" ? "var(--muted-foreground)" : "var(--chart-1)"}
              fillOpacity={entry.name === "Diğer" ? 0.55 : 0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
