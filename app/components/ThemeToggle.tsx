"use client";

import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon, MonitorIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const options: {
  value: "light" | "dark" | "system";
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeIcon = options.find((o) => o.value === theme);
  const IconComponent = activeIcon?.Icon || SunIcon;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-ink-mid hover:bg-[#f0f7f0] dark:hover:bg-[#1a2e24] hover:text-forest dark:hover:text-forest transition-all duration-150 w-full"
        aria-label="Toggle theme"
      >
        <IconComponent className="h-4.5 w-4.5 shrink-0" weight="regular" />
        <span className="flex-1 text-left">Theme</span>
        <span className="text-[11px] text-ink-mid/60 dark:text-ink-mid/50 capitalize">
          {theme}
        </span>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border border-card-border bg-white dark:bg-surface shadow-modal overflow-hidden">
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors ${
                theme === value
                  ? "bg-[#f0f7f0] dark:bg-[#1a2e24] text-forest font-medium"
                  : "text-ink-mid hover:bg-[#f5faf5] dark:hover:bg-[#162c20]"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" weight="regular" />
              <span>{label}</span>
              {theme === value && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
