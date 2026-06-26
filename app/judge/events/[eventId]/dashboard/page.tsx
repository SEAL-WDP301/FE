import { JudgeStats } from "./components/judge-stats";
import { QuickSubmission } from "./components/quick-submission";
import { TodayEvaluations } from "./components/today-evaluations";
import { JudgeDashboardHeader } from "./components/judge-dashboard-header";

export default function JudgePage() {
  return (
    <div className="space-y-6">
      <JudgeDashboardHeader />
      <JudgeStats />
      <TodayEvaluations />
      <QuickSubmission />
    </div>
  );
}
