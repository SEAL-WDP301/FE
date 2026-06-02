import { FeedbackStatusPanel } from "./components/feedback-status-panel";
import { FeedbackThreadCard } from "./components/feedback-thread-card";
import { MeetingScheduleCard } from "./components/meeting-schedule-card";
import { MentorActivityTimeline } from "./components/mentor-activity-timeline";
import { MentorHeader } from "./components/mentor-header";
import { MentorHeroCard } from "./components/mentor-hero-card";
import { SharedResourcesCard } from "./components/shared-resources-card";
import { TeamMentorChatCard } from "./components/team-mentor-chat-card";
import { TeamQuestionsCard } from "./components/team-questions-card";
import {
    chatFeedbackMessages,
    feedbackItems,
    feedbackStats,
    meetings,
    mentorActivities,
    questions,
    resources,
} from "./mock-data";

export default function MentorWorkspacePage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorHeader />
            <MentorHeroCard />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <main className="space-y-5">
                    <MeetingScheduleCard meetings={meetings} />
                    <TeamMentorChatCard messages={chatFeedbackMessages} />
                    <FeedbackThreadCard items={feedbackItems} />
                    <TeamQuestionsCard questions={questions} />
                    <SharedResourcesCard resources={resources} />
                </main>

                <aside className="space-y-5">
                    <FeedbackStatusPanel stats={feedbackStats} />
                    <MentorActivityTimeline activities={mentorActivities} />
                </aside>
            </div>
        </div>
    );
}
