import { MentorPageHeader } from "../_components/mentor-page-header";
import { MentorEmptyState } from "../_components/mentor-query-state";

export default function MentoringSessionsPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <MentorPageHeader title="Mentoring Sessions" subtitle="Mentoring session data from the backend." />
      <MentorEmptyState
        title="Sessions API is not available"
        description="The current backend OpenAPI has no stakeholder endpoint for listing or creating mentoring sessions."
      />
    </div>
  );
}
