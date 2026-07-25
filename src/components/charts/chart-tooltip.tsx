"use client";

/** Recharts için tema uyumlu ortak tooltip içeriği. */
export function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number | string; payload?: { fill?: string } }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
      {label != null && label !== "" && (
        <div className="mb-1 font-medium text-popover-foreground">{label}</div>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ background: entry.payload?.fill ?? "var(--chart-1)" }}
          />
          <span>{entry.name}:</span>
          <span className="font-semibold tabular-nums text-popover-foreground">
            {typeof entry.value === "number"
              ? Intl.NumberFormat("tr-TR").format(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
