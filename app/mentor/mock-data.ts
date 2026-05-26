export type RiskLevel = "Low" | "Medium" | "High";
export type TeamStatus = "On Track" | "Need Support" | "At Risk" | "Inactive";
export type SessionStatus = "Scheduled" | "Completed" | "Missed" | "Cancelled";
export type FeedbackPriority = "Low" | "Medium" | "High" | "Critical";

export const mentorProfile = {
    name: "Huy Nguyen",
    role: "Senior Backend Mentor",
    initials: "HN",
    email: "huy.nguyen@seal.vn",
    expertise: ["System Design", "NestJS", "PostgreSQL", "Cloud", "Security"],
};

export const stats = [
    { label: "Assigned Teams", value: "12", trend: "+2 this week" },
    { label: "Upcoming Sessions", value: "5", trend: "3 today" },
    { label: "Pending Feedback", value: "18", trend: "7 high priority" },
    { label: "Teams At Risk", value: "3", trend: "needs attention" },
];

export const teams = [
    {
        name: "SEAL Warriors",
        avatar: "SW",
        project: "Agile Frontier",
        event: "SEAL Spring 2026",
        leader: "Tam Nguyen",
        members: 4,
        progress: 78,
        risk: "Medium" as RiskLevel,
        status: "Need Support" as TeamStatus,
        lastActivity: "12 minutes ago",
        milestone: "Semi-final Presentation",
    },
    {
        name: "ByteForge",
        avatar: "BF",
        project: "CampusOps AI",
        event: "SEAL Spring 2026",
        leader: "Linh Dao",
        members: 5,
        progress: 92,
        risk: "Low" as RiskLevel,
        status: "On Track" as TeamStatus,
        lastActivity: "1 hour ago",
        milestone: "Final Submission",
    },
    {
        name: "Null Pointers",
        avatar: "NP",
        project: "JudgeFlow",
        event: "SEAL Spring 2026",
        leader: "Minh Hoang",
        members: 3,
        progress: 44,
        risk: "High" as RiskLevel,
        status: "At Risk" as TeamStatus,
        lastActivity: "3 days ago",
        milestone: "Proposal Revision",
    },
    {
        name: "Cloud Nine",
        avatar: "CN",
        project: "DeployMate",
        event: "SEAL Summer 2026",
        leader: "Vy Pham",
        members: 4,
        progress: 61,
        risk: "Medium" as RiskLevel,
        status: "Need Support" as TeamStatus,
        lastActivity: "Yesterday",
        milestone: "Architecture Review",
    },
];

export const sessions = [
    { team: "SEAL Warriors", time: "Today 8:00 PM", topic: "Architecture Review", type: "Google Meet", status: "Scheduled" as SessionStatus },
    { team: "ByteForge", time: "Tomorrow 7:30 PM", topic: "Pitch Dry Run", type: "Discord", status: "Scheduled" as SessionStatus },
    { team: "Null Pointers", time: "Yesterday 9:00 PM", topic: "Risk Recovery", type: "Google Meet", status: "Missed" as SessionStatus },
    { team: "Cloud Nine", time: "Fri 2:00 PM", topic: "Deployment Plan", type: "Offline", status: "Completed" as SessionStatus },
];

export const activities = [
    "Feedback submitted for SEAL Warriors",
    "ByteForge updated final submission",
    "Null Pointers missed scheduled session",
    "Cloud Nine added deployment notes",
];

export const attentionItems = [
    { team: "Null Pointers", reason: "No recent updates", level: "High" },
    { team: "SEAL Warriors", reason: "RBAC feedback unresolved", level: "Medium" },
    { team: "Cloud Nine", reason: "Deployment checklist incomplete", level: "Medium" },
];

export const teamMembers = [
    { name: "Tam Nguyen", role: "Team Leader", contact: "tam@fpt.edu.vn", attendance: "Present", initials: "TA" },
    { name: "An Tran", role: "Backend Developer", contact: "an@fpt.edu.vn", attendance: "Present", initials: "AN" },
    { name: "Khang Le", role: "Frontend Developer", contact: "khang@fpt.edu.vn", attendance: "Late", initials: "KH" },
    { name: "Vy Pham", role: "Presenter", contact: "vy@fpt.edu.vn", attendance: "Present", initials: "VY" },
];

export const milestones = [
    { label: "Registration", state: "completed" },
    { label: "Proposal", state: "completed" },
    { label: "Semi Final", state: "current" },
    { label: "Final Submission", state: "upcoming" },
    { label: "Award Ceremony", state: "locked" },
];

export const feedbackList = [
    { team: "SEAL Warriors", title: "Clarify mentor and judge RBAC", category: "Technical", priority: "High" as FeedbackPriority, date: "Today", status: "Draft" },
    { team: "ByteForge", title: "Improve pitch opening narrative", category: "Presentation", priority: "Medium" as FeedbackPriority, date: "Yesterday", status: "Sent" },
    { team: "Cloud Nine", title: "Strengthen deployment rollback plan", category: "Product", priority: "High" as FeedbackPriority, date: "20 May", status: "Reviewed" },
    { team: "Null Pointers", title: "Reduce scope for semi-final recovery", category: "Teamwork", priority: "Critical" as FeedbackPriority, date: "19 May", status: "Sent" },
];

export const submissions = [
    { team: "SEAL Warriors", title: "proposal-v2.pdf", round: "Semi Final", time: "2 hours ago", type: "PDF", status: "Pending Review" },
    { team: "ByteForge", title: "final-package.zip", round: "Final", time: "Yesterday", type: "ZIP", status: "Ready" },
    { team: "Null Pointers", title: "demo-video-url", round: "Semi Final", time: "3 days ago", type: "URL", status: "Needs Revision" },
    { team: "Cloud Nine", title: "architecture-notes.pdf", round: "Semi Final", time: "Today", type: "PDF", status: "Reviewed" },
];

export const announcements = [
    { title: "Semi-final presentation room updated", content: "All teams should check the new room assignment before Friday.", time: "10 minutes ago", priority: "Important" },
    { title: "Submission deadline reminder", content: "Final semi-final deliverables close tomorrow at 11:59 PM.", time: "1 hour ago", priority: "Urgent" },
    { title: "Workshop recording available", content: "System design workshop recording is now available in resources.", time: "Yesterday", priority: "Normal" },
];
