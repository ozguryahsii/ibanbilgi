"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

/** Kart kenarında dolaşan ışık huzmesi (Magic UI border-beam uyarlaması). */
export function BorderBeam({
  className,
  size = 64,
  duration = 8,
  colorFrom = "var(--chart-1)",
  colorTo = "var(--chart-2)",
}: BorderBeamProps) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <div
        className={cn(
          "absolute aspect-square animate-border-beam bg-gradient-to-l from-(--beam-from) via-(--beam-to) to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--beam-from": colorFrom,
            "--beam-to": colorTo,
            "--beam-duration": duration,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
