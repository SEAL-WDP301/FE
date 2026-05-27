import { ProfileCard } from "./components/profile-card";
import { TeamHistory } from "./components/team-history";
import { PersonalInformation } from "./components/personal-info";
import { AwardsSection } from "./components/awards-section";
import { SecuritySection } from "./components/security-section";

export default function StudentProfilePage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
                    My Profile
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
                    Player Card
                </h1>

                <p className="mt-3 max-w-2xl text-muted-foreground">
                    Your SEAL identity, history, and credentials.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Left Side */}
                <div className="space-y-6">
                    {/* Hero */}
                    <ProfileCard />
                    <TeamHistory />
                </div>

                {/* Right Side */}
                <div className="space-y-6 lg:col-span-2">
                    <PersonalInformation />
                    <AwardsSection />
                    <SecuritySection />
                </div>
            </div>
        </div>
    );
}