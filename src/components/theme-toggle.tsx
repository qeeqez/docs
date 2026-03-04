"use client";
import {Laptop, Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {type HTMLAttributes, useSyncExternalStore} from "react";
import {cn} from "../lib/cn";

const subscribe = () => () => {};

export function ThemeToggle({
  className,
  mode = "light-dark",
  ...props
}: HTMLAttributes<HTMLElement> & {
  mode?: "light-dark" | "light-dark-system";
}) {
  const {setTheme, theme, resolvedTheme} = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const resolved = mounted ? resolvedTheme : "dark";
  const currentMode = mounted ? theme : "dark";

  const icon = (() => {
    if (mode === "light-dark-system" && currentMode === "system") return Laptop;
    return resolved === "dark" ? Moon : Sun;
  })();
  const Icon = icon;

  const nextTheme = () => {
    if (mode === "light-dark-system") {
      if (currentMode === "light") return "dark";
      if (currentMode === "dark") return "system";
      return "light";
    }

    return resolved === "light" ? "dark" : "light";
  };

  return (
    <button
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-fd-border/70 bg-fd-card/70 text-fd-muted-foreground transition-colors hover:bg-fd-accent/40 hover:text-fd-accent-foreground",
        className
      )}
      aria-label="Toggle theme"
      onClick={() => setTheme(nextTheme())}
      data-theme-toggle=""
      type="button"
      {...props}
    >
      <Icon className="size-4.5" />
    </button>
  );
}
