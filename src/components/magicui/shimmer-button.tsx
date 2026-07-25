"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ComponentProps<"button"> {
  shimmerDuration?: string;
}

/** Kenarında ışıltı dönen birincil aksiyon butonu (Magic UI shimmer-button uyarlaması). */
export function ShimmerButton({
  shimmerDuration = "3s",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={{ "--speed": shimmerDuration } as React.CSSProperties}
      className={cn(
        "group relative z-0 inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-2xl border border-white/10 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-primary/45 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0]">
          <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-45deg),transparent_0,#fff_90deg,transparent_90deg)] [translate:0_0]" />
        </div>
      </div>
      {children}
      <div className="absolute -z-20 [background:var(--color-primary)] [border-radius:calc(1rem-1px)] [inset:1px]" />
    </button>
  );
}
