export type ProgressStepStatus = "completed" | "current" | "locked";

export type ProgressStep = {
    label: string;
    status: ProgressStepStatus;
};

export type TeamMember = {
    name: string;
    initials: string;
    role: string;
    skills: string[];
};

export type ActivityItem = {
    label: string;
    time: string;
};

export type TeamSummary = {
    name: string;
    initials: string;
    track: string;
    currentRound: string;
    status: string;
    memberCount: string;
    mentor: string;
    description: string;
};

export type SubmissionSummary = {
    fileName: string;
    status: string;
    uploadedBy: string;
    lastUpdated: string;
};

export type MentorFeedback = {
    mentorName: string;
    comment: string;
    note: string;
};

export type DeadlineSummary = {
    title: string;
    dueDate: string;
    countdown: string;
    helperText: string;
};

export const team: TeamSummary = {
    name: "SEAL Warriors",
    initials: "SW",
    track: "Web Development",
    currentRound: "Semi Final",
    status: "Approved",
    memberCount: "4 / 5",
    mentor: "Mr. Long Nguyen",
    description:
        "Web Development track workspace for planning, submissions, mentor feedback, and round progress.",
};

export const progressSteps: ProgressStep[] = [
    { label: "Team Registered", status: "completed" },
    { label: "Team Approved", status: "completed" },
    { label: "Proposal Submitted", status: "completed" },
    { label: "Semi-final Presentation", status: "current" },
    { label: "Final Submission", status: "locked" },
];

export const members: TeamMember[] = [
    {
        name: "Tam",
        initials: "TA",
        role: "Team Leader",
        skills: ["Frontend", "UI/UX"],
    },
    {
        name: "An",
        initials: "AN",
        role: "Backend Developer",
        skills: ["NestJS", "PostgreSQL"],
    },
    {
        name: "Khang",
        initials: "KH",
        role: "Frontend Developer",
        skills: ["NextJS", "Shadcn UI"],
    },
    {
        name: "Vy",
        initials: "VY",
        role: "Presenter",
        skills: ["Research", "Pitching"],
    },
];

export const activities: ActivityItem[] = [
    { label: "An joined the team", time: "12 minutes ago" },
    { label: "Tam uploaded proposal-v2.pdf", time: "2 hours ago" },
    { label: "Mentor commented on submission", time: "Yesterday" },
    { label: "Round status changed to Semi Final", time: "2 days ago" },
];

export const submission: SubmissionSummary = {
    fileName: "proposal-v2.pdf",
    status: "Submitted",
    uploadedBy: "Team Leader",
    lastUpdated: "2 hours ago",
};

export const mentorFeedback: MentorFeedback = {
    mentorName: "Mr. Long Nguyen",
    comment:
        "Your API architecture is good, but authentication flow needs more clarity.",
    note: "Mentor feedback · Read-only view available",
};

export const deadline: DeadlineSummary = {
    title: "Round 1 Submission",
    dueDate: "23 May 2026, 11:59 PM",
    countdown: "2 days left",
    helperText: "Upload your latest package before the round closes.",
};
