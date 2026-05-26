import { CurrentRoundCard } from "./components/current-round-card";
import { FeedbackCard } from "./components/feedback-card";
import { LinkInputsCard } from "./components/link-inputs-card";
import { SubmissionHistoryCard } from "./components/submission-history-card";
import { SubmissionRequirementsCard } from "./components/submission-requirements-card";
import { SubmissionStatusCard } from "./components/submission-status-card";
import { SubmissionsHeader } from "./components/submissions-header";
import { UploadAreaCard } from "./components/upload-area-card";
import {
    currentRound,
    feedback,
    history,
    linkFields,
    requirements,
    submissionStatus,
    uploadedFile,
} from "./mock-data";

export default function SubmissionsPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <SubmissionsHeader countdown={currentRound.countdown} />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                <main className="space-y-5">
                    <CurrentRoundCard round={currentRound} />

                    <div className="grid gap-5 lg:grid-cols-2">
                        <UploadAreaCard file={uploadedFile} />
                        <SubmissionRequirementsCard requirements={requirements} />
                    </div>

                    <LinkInputsCard fields={linkFields} />
                    <SubmissionHistoryCard history={history} />
                </main>

                <aside className="space-y-5">
                    <SubmissionStatusCard status={submissionStatus} />
                    <FeedbackCard feedback={feedback} />
                </aside>
            </div>
        </div>
    );
}
