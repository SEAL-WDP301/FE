"use client";

import {
    Calendar,
    Trophy,
    Upload,
    Users,
    TrendingUp,
} from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

interface StatCardProps {
    icon: string;
    label: string;
    value: number;
    trend: string;
}

export function StatCard({
    icon,
    label,
    value,
    trend,
}: StatCardProps) {

    const renderIcon = () => {
        switch (icon) {
            case "calendar":
                return <Calendar className="h-5 w-5 text-orange-400" />;

            case "users":
                return <Users className="h-5 w-5 text-orange-400" />;

            case "trophy":
                return <Trophy className="h-5 w-5 text-orange-400" />;

            case "upload":
                return <Upload className="h-5 w-5 text-orange-400" />;

            default:
                return <Calendar className="h-5 w-5 text-orange-400" />;
        }
    };

    return (
        <GlassCard className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {label}
                    </p>

                    <h2 className="mt-3 text-5xl font-bold text-white">
                        {value}
                    </h2>

                    <div className="mt-3 flex items-center gap-1 text-sm text-green-400">
                        <TrendingUp className="h-4 w-4" />
                        {trend}
                    </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10">
                    {renderIcon()}
                </div>
            </div>
        </GlassCard>
    );
}