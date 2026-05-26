import { GlassCard } from "@/components/ui/glass-card";
import { Bell, CheckCircle2, Trophy, Upload, UserPlus } from "lucide-react";

const activities = [
     {
        icon: UserPlus,
        title: "New teammate joined",
        detail: "Trần Hải Đăng joined Team NebulaForge",
        time: "12m ago",
    },
    {
        icon: Upload,
        title: "Submission uploaded",
        detail: "Round 3 prototype pushed to GitHub",
        time: "1h ago",
    },
    {
        icon: Trophy,
        title: "Ranking updated",
        detail: "You moved up 4 places → #7 overall",
        time: "3h ago",
    },
    {
        icon: Bell,
        title: "New announcement",
        detail: "Mentor office hours opened for Round 4",
        time: "Yesterday",
    },
    {
        icon: CheckCircle2,
        title: "Round 2 cleared",
        detail: "Judges approved your MVP demo",
        time: "2d ago",
    },
]

export function RecentActivity() {
    return (
        <GlassCard className="p-0">
            <div className="border-b border-white/10 p-5">
                <h3 className="text-sm font-semibold text-white">
                    Recent activity
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                    Last 7 days
                </p>
            </div>

            <div className="space-y-5 p-5">
                {activities.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div key={index} className="flex gap-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                                <Icon className="h-4 w-4 text-orange-400" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white">
                                    {item.title}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {item.detail}
                                </p>

                                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}