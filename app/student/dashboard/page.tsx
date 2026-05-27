import { ActiveEventsSection } from "./components/active-events-section";
import { EventHubHero } from "./components/event-hub-hero";
import { EventHubSidePanel } from "./components/event-hub-side-panel";
import { EventTracksSection } from "./components/event-tracks-section";
import { MyEventsSection } from "./components/my-events-section";
import {
    activeEvents,
    announcements,
    myEvents,
    quickStats,
    tracks,
    upcomingEvents,
} from "./overview-data";

export default function StudentDashboardPage() {
    return (
        <div className="mx-auto w-full max-w-[1440px] space-y-5">
            <EventHubHero />

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
                <main className="min-w-0 space-y-7">
                    <ActiveEventsSection events={activeEvents} />
                    <MyEventsSection events={myEvents} />
                    <EventTracksSection tracks={tracks} />
                </main>

                <EventHubSidePanel
                    upcomingEvents={upcomingEvents}
                    announcements={announcements}
                    quickStats={quickStats}
                />
            </div>
        </div>
    );
}
