import { cn } from "@/lib/utils";

/** Akan gradyanlı vurgu metni. */
export function AnimatedGradientText({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "animate-gradient-x bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
