import { CalendarOverviewCard } from "./components/calendar-overview-card";
import { DailyTimelineCard } from "./components/daily-timeline-card";
import { RoundRoadmapCard } from "./components/round-roadmap-card";
import { TeamRemindersCard } from "./components/team-reminders-card";
import { UpcomingEventsPanel } from "./components/upcoming-events-panel";
import {
    calendarDays,
    dailyTimeline,
    reminders,
    roadmap,
    upcomingEvents,
} from "./mock-data";

export default function SchedulePage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
                    Team workspace
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
                    Schedule
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Track your hackathon timeline and upcoming activities
                </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <main className="space-y-5">
                    <CalendarOverviewCard days={calendarDays} />
                    <DailyTimelineCard items={dailyTimeline} />
                    <RoundRoadmapCard steps={roadmap} />
                </main>

                <aside className="space-y-5">
                    <UpcomingEventsPanel events={upcomingEvents} />
                    <TeamRemindersCard reminders={reminders} />
                </aside>
            </div>
        </div>
    );
}
