import { StatCard } from "./stat-card";

const stats = [
    {
        icon: "calendar",
        label: "Joined Events",
        value: 6,
        trend: "+2 this season",
    },
    {
        icon: "users",
        label: "Team Members",
        value: 5,
        trend: "Full roster",
    },
    {
        icon: "trophy",
        label: "Current Ranking",
        value: 7,
        trend: "↑ 4 from last round",
    },
    {
        icon: "upload",
        label: "Submissions",
        value: 12,
        trend: "Round 3 pending review",
    },
];

export function StatsSection() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
                <StatCard key={item.label} {...item} />
            ))}
        </div>
    );
}