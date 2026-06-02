export type FeedbackState = "resolved" | "unresolved";
export type QuestionStatus = "Answered" | "Waiting" | "Urgent";

export type FeedbackItem = {
    category: "UI/UX" | "Backend" | "Presentation" | "Architecture" | "Research";
    related: string;
    timestamp: string;
    text: string;
    reply: string;
    state: FeedbackState;
};

export type TeamQuestion = {
    member: string;
    initials: string;
    question: string;
    response: string;
    status: QuestionStatus;
};

export type SharedResource = {
    title: string;
    type: string;
    uploadedAt: string;
};

export type MentorActivity = {
    label: string;
    time: string;
};

export type ChatFeedbackMessage = {
    id: string;
    author: string;
    initials: string;
    role: "Team" | "Mentor";
    type: "Chat" | "Feedback";
    timestamp: string;
    message: string;
    status?: "Needs action" | "Reviewed";
};

export const mentor = {
    name: "Mr. Huy Nguyen",
    initials: "HN",
    role: "Senior Backend Engineer",
    expertise: ["System Design", "NestJS", "PostgreSQL", "Cloud Architecture"],
    bio: "Startup advisor and backend mentor helping teams turn strong ideas into maintainable architecture, secure APIs, and reliable deployment plans.",
    availability: "Available: Mon - Fri, 7PM - 10PM",
};

export const reviewSummary = {
    progressStatus: "Semi Final Review",
    completion: 68,
    upcomingSession: "Tomorrow • 8:00 PM",
};

export const feedbackItems: FeedbackItem[] = [
    {
        category: "Architecture",
        related: "Submission v2",
        timestamp: "Today, 9:15 PM",
        text: "Your authentication flow is good, but role management still needs clearer separation between judges and mentors.",
        reply: "We updated the RBAC architecture and separated event roles.",
        state: "unresolved",
    },
    {
        category: "Backend",
        related: "API module draft",
        timestamp: "Yesterday, 7:40 PM",
        text: "Split submission review logic from team workspace logic so permissions stay easier to audit.",
        reply: "Moved review endpoints into a dedicated module and added guard notes.",
        state: "resolved",
    },
    {
        category: "Presentation",
        related: "Pitch deck v1",
        timestamp: "20 May, 10:20 PM",
        text: "The demo flow is clear. Add one slide explaining why the technical choices support scale.",
        reply: "Added a scalability slide with queue, cache, and audit logging notes.",
        state: "resolved",
    },
];

export const chatFeedbackMessages: ChatFeedbackMessage[] = [
    {
        id: "mentor-feedback-auth",
        author: "Mr. Huy Nguyen",
        initials: "HN",
        role: "Mentor",
        type: "Feedback",
        timestamp: "Today, 9:15 PM",
        message:
            "RBAC direction is good. Please add a short permission matrix for student, mentor, judge, and organizer before the next demo.",
        status: "Needs action",
    },
    {
        id: "team-auth-follow-up",
        author: "Team Nova",
        initials: "TN",
        role: "Team",
        type: "Chat",
        timestamp: "Today, 9:28 PM",
        message:
            "We are updating the matrix now. Should mentor permissions be scoped by event round or by assigned team only?",
    },
    {
        id: "mentor-round-scope",
        author: "Mr. Huy Nguyen",
        initials: "HN",
        role: "Mentor",
        type: "Feedback",
        timestamp: "Today, 9:36 PM",
        message:
            "Scope by assigned team first, then include event round in the query filter so historical reviews stay auditable.",
        status: "Reviewed",
    },
];

export const feedbackStats = [
    { label: "Total feedback", value: "12" },
    { label: "Resolved", value: "8" },
    { label: "Pending review", value: "3" },
    { label: "High priority", value: "1" },
];

export const questions: TeamQuestion[] = [
    {
        member: "Tam",
        initials: "TA",
        question: "Should we separate judge_assignment table?",
        response: "Yes. Keep assignment scoped by event and round so review permissions are explicit.",
        status: "Answered",
    },
    {
        member: "An",
        initials: "AN",
        question: "How should we structure API modules?",
        response: "Group by domain first: teams, submissions, reviews, events, and auth.",
        status: "Answered",
    },
    {
        member: "Khang",
        initials: "KH",
        question: "Can we simplify mentor view permissions before demo?",
        response: "Waiting for mentor response.",
        status: "Waiting",
    },
];

export const resources: SharedResource[] = [
    {
        title: "RBAC architecture checklist",
        type: "Document",
        uploadedAt: "Uploaded today",
    },
    {
        title: "NestJS module boundary example",
        type: "GitHub",
        uploadedAt: "Uploaded yesterday",
    },
    {
        title: "Submission review sequence diagram",
        type: "Diagram",
        uploadedAt: "Uploaded 2 days ago",
    },
];

export const mentorActivities: MentorActivity[] = [
    { label: "Mentor reviewed submission v2", time: "14 minutes ago" },
    { label: "Mentor scheduled meeting", time: "1 hour ago" },
    { label: "Mentor resolved architecture question", time: "Yesterday" },
];
