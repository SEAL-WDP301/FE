export type EventPhase = "Registration Open" | "In Progress" | "Final Round" | "Closed";
export type TeamStatus = "Registered" | "Approved" | "Semi Final" | "Finalist";

export type ActiveEvent = {
    title: string;
    description: string;
    phase: EventPhase;
    deadline: string;
    participants: string;
    prizePool: string;
    tracks: string[];
    accent: string;
};

export type MyEvent = {
    eventId?: number;
    teamName: string;
    eventName: string;
    round: string;
    status: TeamStatus;
    progress: number;
};

export type TrackCategory = {
    title: string;
    count: number;
    description: string;
};

export type UpcomingEvent = {
    title: string;
    opensIn: string;
    date: string;
};

export type Announcement = {
    title: string;
    time: string;
    priority: "Normal" | "Important" | "Urgent";
};

export const activeEvents: ActiveEvent[] = [
    {
        title: "SEAL Spring 2026",
        description: "Build production-ready software products with mentors, judges, and startup-style delivery pressure.",
        phase: "Registration Open",
        deadline: "Closes 30 May 2026",
        participants: "2,644 participants",
        prizePool: "140M VND",
        tracks: ["Web Development", "AI", "Cloud"],
        accent: "from-[#f37021]/35 via-[#ff8a3d]/10 to-transparent",
    },
    {
        title: "SEAL Agile Frontier",
        description: "A semi-final sprint for teams proving architecture, collaboration, and user-facing execution.",
        phase: "In Progress",
        deadline: "Round closes 02 Jun 2026",
        participants: "480 participants",
        prizePool: "80M VND",
        tracks: ["Mobile", "UI/UX", "Cloud"],
        accent: "from-sky-500/25 via-[#f37021]/10 to-transparent",
    },
    {
        title: "SEAL Innovation Cup",
        description: "Final-round showcase for teams building high-impact education and productivity platforms.",
        phase: "Final Round",
        deadline: "Final demo 12 Jun 2026",
        participants: "126 finalists",
        prizePool: "200M VND",
        tracks: ["AI", "IoT", "Web Development"],
        accent: "from-purple-500/25 via-[#f37021]/10 to-transparent",
    },
];

export const myEvents: MyEvent[] = [
    {
        eventId: 9,
        teamName: "SEAL Demo Two Rounds",
        eventName: "Bulding Rag AI Automation",
        round: "Semi Final",
        status: "Semi Final",
        progress: 74,
    },
    {
        teamName: "Orange Stack",
        eventName: "SEAL Agile Frontier",
        round: "Proposal Review",
        status: "Approved",
        progress: 42,
    },
];

export const tracks: TrackCategory[] = [
    { title: "Web Development", count: 8, description: "Full-stack products, dashboards, SaaS tools." },
    { title: "Artificial Intelligence", count: 6, description: "Applied AI, automation, and model-backed workflows." },
    { title: "Mobile Development", count: 4, description: "Cross-platform apps and student mobile utilities." },
    { title: "Cloud Computing", count: 5, description: "Infrastructure, deployment, observability, and scale." },
    { title: "UI/UX Design", count: 7, description: "Product design, research, prototypes, and design systems." },
    { title: "IoT", count: 3, description: "Connected devices and real-world campus automation." },
];

export const upcomingEvents: UpcomingEvent[] = [
    { title: "SEAL Summer 2026", opensIn: "Registration opens in 12 days", date: "08 Jun 2026" },
    { title: "SEAL Cloud Sprint", opensIn: "Registration opens in 21 days", date: "17 Jun 2026" },
    { title: "SEAL Mobile Jam", opensIn: "Registration opens in 34 days", date: "30 Jun 2026" },
];

export const announcements: Announcement[] = [
    { title: "Semi Final schedule updated", time: "12 minutes ago", priority: "Important" },
    { title: "Mentor registration is now open", time: "1 hour ago", priority: "Normal" },
    { title: "Submission deadline extended", time: "Yesterday", priority: "Urgent" },
];

export const quickStats = [
    { label: "Active Events", value: "12" },
    { label: "Joined Teams", value: "2" },
    { label: "Upcoming Deadlines", value: "4" },
    { label: "Total Participants", value: "3.2K" },
];
