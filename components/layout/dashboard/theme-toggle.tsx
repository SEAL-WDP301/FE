"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const Icon = isDark ? Sun : Moon;

    return (
        <Button
            type="button"
            variant="dashboardIcon"
            size="dashboardIcon"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="relative"
        >
            <Icon className="h-[18px] w-[18px]" />
        </Button>
    );
}
