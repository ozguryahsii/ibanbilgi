"use client";

import { motion } from "motion/react";
import { DotPattern } from "@/components/magicui/dot-pattern";

/** Sayfa içeriğini saran, giriş animasyonlu ortak kabuk. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <DotPattern
        width={24}
        height={24}
        className="[mask-image:radial-gradient(600px_circle_at_top,white,transparent)]"
      />
      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10"
      >
        {children}
      </motion.main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
