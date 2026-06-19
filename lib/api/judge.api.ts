import { axiosClient } from "../axios";

export type JudgeScoringStatus = "pending" | "in_review" | "completed";

export interface JudgeAssignedRound {
  assignmentId: number;
  roundId: number;
  roundNumber: number;
  roundName: string;
  roundStatus: string;
  trackId: number | null;
  trackName: string | null;
}

export interface JudgeAssignedEvent {
  id: number;
  name: string;
  season: string;
  year: number;
  status: string;
  rounds: JudgeAssignedRound[];
}

export interface JudgeRoundSubmission {
  submissionId: number;
  id: number;
  teamId: number;
  teamName: string;
  track: { id: number; name: string };
  githubUrl?: string | null;
  assignedRepoUrl?: string | null;
  university?: string | null;
  status: string;
  submittedAt?: string | null;
  scoringStatus: JudgeScoringStatus;
  scoredCriteria: number;
  totalCriteria: number;
  weightedScore?: number | null;
}

export interface JudgeRubric {
  id: number;
  name: string;
  description?: string | null;
  maxScore: number;
  weight: number | string;
}

export interface JudgeScoreEntry {
  criterionId: number;
  scoreValue: number | string;
  comment?: string | null;
  criterion?: JudgeRubric;
}

export interface JudgeSubmissionDetail {
  id: number;
  status: string;
  fileUrl?: string | null;
  githubUrl?: string | null;
  assignedRepoUrl?: string | null;
  description?: string | null;
  submittedAt?: string | null;
  team: {
    id: number;
    name: string;
    githubRepoUrl?: string | null;
    track: { id: number; name: string };
    leader?: { id: number; name: string; email: string };
    members?: Array<{ user: { id: number; name: string; email: string } }>;
  };
  round: {
    id: number;
    name: string;
    roundNumber: number;
    status: string;
    submissionDeadline?: string | null;
  };
  event: { id: number; name: string; season: string; year: number };
  rubrics: JudgeRubric[];
  myScores: JudgeScoreEntry[];
  scoringStatus: JudgeScoringStatus;
  weightedScore?: number | null;
}

export interface SubmitJudgeScoresPayload {
  scores: Array<{
    criterionId: number;
    scoreValue: number;
    comment?: string;
  }>;
}

export const judgeApi = {
  getAssignedEvents: async () => {
    const response = await axiosClient.get("/judge/events");
    return response.data?.data as JudgeAssignedEvent[];
  },

  getRoundSubmissions: async (roundId: number) => {
    const response = await axiosClient.get(`/judge/rounds/${roundId}/submissions`);
    return response.data?.data as JudgeRoundSubmission[];
  },

  getSubmissionDetail: async (submissionId: number) => {
    const response = await axiosClient.get(`/judge/submissions/${submissionId}`);
    return response.data?.data as JudgeSubmissionDetail;
  },

  submitScores: async (
    submissionId: number,
    payload: SubmitJudgeScoresPayload,
  ) => {
    const response = await axiosClient.put(
      `/judge/submissions/${submissionId}/scores`,
      payload,
    );
    return response.data?.data as {
      scoringStatus: JudgeScoringStatus;
      weightedScore: number | null;
    };
  },
};

export function computeLocalWeightedScore(
  rubrics: JudgeRubric[],
  scores: Record<number, number>,
): number | null {
  if (!rubrics.length) return null;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const rubric of rubrics) {
    const value = scores[rubric.id];
    if (value === undefined) continue;

    const weight = Number(rubric.weight);
    const normalized = (value / rubric.maxScore) * 10;
    weightedSum += normalized * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return null;
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function mapScoringStatusLabel(status: JudgeScoringStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_review":
      return "In Review";
    default:
      return "Pending";
  }
}
