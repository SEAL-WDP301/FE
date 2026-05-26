import { CalendarOverviewCard } from "./components/calendar-overview-card";
import { DailyTimelineCard } from "./components/daily-timeline-card";
import { DeadlineTrackerCard } from "./components/deadline-tracker-card";
import { MentorMeetingsCard } from "./components/mentor-meetings-card";
import { RoundRoadmapCard } from "./components/round-roadmap-card";
import { ScheduleHeader } from "./components/schedule-header";
import { TeamRemindersCard } from "./components/team-reminders-card";
import { UpcomingEventsPanel } from "./components/upcoming-events-panel";
import {
    calendarDays,
    dailyTimeline,
    deadline,
    mentorMeetings,
    reminders,
    roadmap,
    scheduleMeta,
    upcomingEvents,
} from "./mock-data";

export default function SchedulePage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <ScheduleHeader meta={scheduleMeta} />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <main className="space-y-5">
                    <CalendarOverviewCard days={calendarDays} />
                    <DailyTimelineCard items={dailyTimeline} />
                    <MentorMeetingsCard meetings={mentorMeetings} />
                    <RoundRoadmapCard steps={roadmap} />
                </main>

                <aside className="space-y-5">
                    <UpcomingEventsPanel events={upcomingEvents} />
                    <DeadlineTrackerCard deadline={deadline} />
                    <TeamRemindersCard reminders={reminders} />
                </aside>
            </div>
        </div>
    );
}
