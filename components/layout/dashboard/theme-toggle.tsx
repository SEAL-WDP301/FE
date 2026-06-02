"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const light = theme === "light";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn(
                "relative h-11 w-[88px] overflow-hidden rounded-full border border-border bg-card/60 p-1 backdrop-blur-xl transition-all duration-300",
                !light &&
                "shadow-[0_0_30px_rgba(243,112,33,0.18)]"
            )}
        >
            {/* Toggle Circle */}
            <motion.span
                layout
                transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 250,
                }}
                className={cn(
                    "absolute top-1 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                    light
                        ? "right-1 bg-white text-amber-500 shadow-md"
                        : "left-1 bg-gradient-to-br from-orange-500 to-orange-400 text-black shadow-[0_0_18px_rgba(243,112,33,0.55)]"
                )}
            >
                {light ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
            </motion.span>

            {/* Hidden inactive icon */}
            <div className="flex h-full items-center justify-between px-2">
                <div className="flex w-8 items-center justify-center">
                    {!light && (
                        <Sun className="h-4 w-4 text-muted-foreground/40" />
                    )}
                </div>

                <div className="flex w-8 items-center justify-center">
                    {light && (
                        <Moon className="h-4 w-4 text-muted-foreground/40" />
                    )}
                </div>
            </div>
        </button>
    );
}