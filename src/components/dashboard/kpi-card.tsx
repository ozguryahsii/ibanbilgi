"use client";

import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "destructive" | "neutral";
  hint?: string;
  index?: number;
}

const TONE_STYLES = {
  primary: "from-chart-1/15 to-transparent text-primary",
  success: "from-success/15 to-transparent text-success",
  destructive: "from-destructive/15 to-transparent text-destructive",
  neutral: "from-muted to-transparent text-muted-foreground",
} as const;

export function KpiCard({
  title,
  value,
  icon: Icon,
  tone = "primary",
  hint,
  index = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <Card className="relative overflow-hidden p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br",
            TONE_STYLES[tone]
          )}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              <NumberTicker value={value} delay={index * 0.07} />
            </p>
            {hint && (
              <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
            )}
          </div>
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur",
              TONE_STYLES[tone].split(" ").pop()
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
