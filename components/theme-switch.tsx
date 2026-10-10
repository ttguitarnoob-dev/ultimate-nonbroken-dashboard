"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={onChange}
      className={`cursor-pointer p-1 transition-opacity hover:opacity-80 ${className ?? ""}`}
    >
      {mounted && theme === "light" ? (
        <MoonFilledIcon size={22} />
      ) : (
        <SunFilledIcon size={22} />
      )}
    </button>
  );
};
