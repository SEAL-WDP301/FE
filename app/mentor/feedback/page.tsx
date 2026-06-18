import { MentorPageHeader } from "../_components/mentor-page-header";
import { MentorEmptyState } from "../_components/mentor-query-state";

export default function FeedbackManagementPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <MentorPageHeader title="Feedback Management" subtitle="Mentor feedback stored by the backend." />
      <MentorEmptyState
        title="Feedback API is not available"
        description="The current backend OpenAPI has no stakeholder endpoint for reading or submitting mentor feedback."
      />
    </div>
  );
}
