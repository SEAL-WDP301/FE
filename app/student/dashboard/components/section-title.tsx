import type { ComponentType } from "react";

type SectionTitleProps = {
    icon: ComponentType<{ className?: string }>;
    label: string;
};

export function SectionTitle({ icon: Icon, label }: SectionTitleProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                <Icon className="h-4 w-4 text-orange-400" />
            </div>
            <h2 className="text-base font-semibold text-white">
                {label}
            </h2>
        </div>
    );
}
