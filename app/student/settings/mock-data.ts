export type PermissionKey =
    | "Can upload submission"
    | "Can invite members"
    | "Can edit settings"
    | "Can schedule meetings";

export type PermissionMember = {
    name: string;
    initials: string;
    role: string;
    permissions: Record<PermissionKey, boolean>;
};

export type Integration = {
    name: string;
    icon: string;
    status: "Connected" | "Not connected";
    lastSynced: string;
};

export type TeamProfile = {
    name: string;
    description: string;
    slogan: string;
    track: string;
    university: string;
    visibility: string;
};

export const teamProfile: TeamProfile = {
    name: "SEAL Warriors",
    description: "We build scalable systems for hackathon competitions.",
    slogan: "Ship fast. Review clean. Win together.",
    track: "Web Development",
    university: "FPT University HCMC",
    visibility: "Public",
};

export const permissions: PermissionMember[] = [
    {
        name: "Tam",
        initials: "TA",
        role: "Team Leader",
        permissions: {
            "Can upload submission": true,
            "Can invite members": true,
            "Can edit settings": true,
            "Can schedule meetings": true,
        },
    },
    {
        name: "An",
        initials: "AN",
        role: "Backend Developer",
        permissions: {
            "Can upload submission": true,
            "Can invite members": false,
            "Can edit settings": false,
            "Can schedule meetings": true,
        },
    },
    {
        name: "Vy",
        initials: "VY",
        role: "Presenter",
        permissions: {
            "Can upload submission": false,
            "Can invite members": false,
            "Can edit settings": false,
            "Can schedule meetings": true,
        },
    },
];

export const notifications = [
    { label: "Submission deadline alerts", enabled: true },
    { label: "Mentor feedback notifications", enabled: true },
    { label: "Team activity updates", enabled: true },
    { label: "Round changes", enabled: true },
    { label: "Email notifications", enabled: false },
    { label: "Push notifications", enabled: true },
];

export const integrations: Integration[] = [
    { name: "GitHub", icon: "GH", status: "Connected", lastSynced: "Synced 12 minutes ago" },
    { name: "Google Drive", icon: "GD", status: "Connected", lastSynced: "Synced 1 hour ago" },
    { name: "Discord", icon: "DC", status: "Connected", lastSynced: "Synced yesterday" },
    { name: "Figma", icon: "FG", status: "Not connected", lastSynced: "Never synced" },
];

export const workspacePreferences = [
    { label: "Timezone", value: "Asia/Ho_Chi_Minh" },
    { label: "Language", value: "English / Vietnamese" },
    { label: "Calendar format", value: "Monday first" },
    { label: "Auto-save submissions", value: "Enabled" },
    { label: "Activity visibility", value: "Team only" },
];
