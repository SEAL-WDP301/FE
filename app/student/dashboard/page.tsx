import { CurrentEvent } from "./components/current-event";
import { RecentActivity } from "./components/recent-activity";
import { StatsSection } from "./components/stats-section";

export default function StudentDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
                    Welcome back, Khoa
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
                    Mission Control
                </h1>

                <p className="mt-3 max-w-2xl text-muted-foreground">
                    Track your hackathon journey, submissions,
                    and team performance — all in one place.
                </p>
            </div>

            {/* Stats */}
            <StatsSection />

            {/* Main content */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <CurrentEvent />
                <RecentActivity />
            </div>
        </div>
    );
}