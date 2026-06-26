import ScheduleFilters from "./compoments/schedule-filter";
import ScheduleCalendar from "./compoments/schedule-calendar";
import ScheduleDetailPanel from "./compoments/schedule-detail-pannel";
import UpcomingDeadlines from "./compoments/upcoming-dealine";

export default function SchedulePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
                    Schedule
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Track evaluation deadlines, judging sessions, calibration and event milestones.
                </p>
            </div>

            <ScheduleFilters />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                <ScheduleCalendar />
                <ScheduleDetailPanel />
            </div>

            <UpcomingDeadlines />
        </div>
    );
}