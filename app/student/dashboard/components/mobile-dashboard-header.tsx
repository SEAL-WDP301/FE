export function MobileDashboardHeader() {
    return (
        <div className="md:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
                Team Workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Good evening, Tam
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Here is your team progress for SEAL Hackathon
            </p>
        </div>
    );
}
