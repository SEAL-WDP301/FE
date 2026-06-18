import { MentorPageHeader } from "../_components/mentor-page-header";
import { MentorEmptyState } from "../_components/mentor-query-state";

export default function SubmissionsReviewPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <MentorPageHeader title="Submissions Review" subtitle="Submissions assigned to the current mentor." />
      <MentorEmptyState
        title="Mentor submissions API is not available"
        description="The backend currently exposes submissions to organizers and students, but not to stakeholder mentor accounts."
      />
    </div>
  );
}
