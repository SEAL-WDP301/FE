import { cn } from "@/lib/utils";

type SettingsToggleProps = {
    enabled: boolean;
};

export function SettingsToggle({ enabled }: SettingsToggleProps) {
    return (
        <span
            className={cn(
                "flex h-6 w-11 items-center rounded-full border p-0.5 transition-colors",
                enabled
                    ? "border-orange-500/30 bg-orange-500/25"
                    : "border-white/10 bg-white/[0.04]"
            )}
        >
            <span
                className={cn(
                    "h-4.5 w-4.5 rounded-full transition-transform",
                    enabled ? "translate-x-5 bg-orange-400" : "translate-x-0 bg-white/40"
                )}
            />
        </span>
    );
}
