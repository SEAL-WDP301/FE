import { JudgeStats } from "./components/judge-stats";
import { QuickSubmission } from "./components/quick-submission";
import { TodayEvaluations } from "./components/today-evaluations";

export default function JudgePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
                    Welcome back, Dr. Minh
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    You have 6 pending evaluations across 2 active events. Stay sharp — the semi-finals close in 18 hours.
                </p>
            </div>

            <JudgeStats />

                <TodayEvaluations />
          

            <QuickSubmission />
        </div>
    );
}