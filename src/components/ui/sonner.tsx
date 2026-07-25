"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={(resolvedTheme ?? "dark") as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group rounded-2xl! border-border/60! bg-popover! text-popover-foreground! shadow-xl! backdrop-blur-md!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
