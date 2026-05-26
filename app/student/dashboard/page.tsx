import { DeadlineCard } from "./components/deadline-card";
import { MentorFeedbackCard } from "./components/mentor-feedback-card";
import { MobileDashboardHeader } from "./components/mobile-dashboard-header";
import { ProgressTimelineCard } from "./components/progress-timeline-card";
import { RecentActivityPanel } from "./components/recent-activity-panel";
import { SubmissionStatusCard } from "./components/submission-status-card";
import { TeamHeroCard } from "./components/team-hero-card";
import { TeamMembersPreview } from "./components/team-members-preview";
import {
    activities,
    deadline,
    mentorFeedback,
    members,
    progressSteps,
    submission,
    team,
} from "./mock-data";


export default function StudentDashboardPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-5">
            <MobileDashboardHeader />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <main className="space-y-5">
                    <TeamHeroCard team={team} />
                    <ProgressTimelineCard steps={progressSteps} />

                    <div className="grid gap-5 lg:grid-cols-2">
                        <SubmissionStatusCard submission={submission} />
                        <MentorFeedbackCard feedback={mentorFeedback} />
                    </div>

                    <TeamMembersPreview members={members} />
                </main>

                <aside className="space-y-5">
                    <DeadlineCard deadline={deadline} />
                    <RecentActivityPanel activities={activities} />
                </aside>
            </div>
        </div>
    );
}
