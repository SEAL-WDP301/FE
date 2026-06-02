import { ProfileCard } from "./components/profile-card";
import { PersonalInformation } from "./components/personal-info";
import { SecuritySection } from "./components/security-section";

export default function StudentProfilePage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
                    Profile
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Your judge identity, judging history & evaluation footprint across SEAL events.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Left Side */}
                <div className="space-y-6">
                    {/* Hero */}
                    <ProfileCard />
                </div>

                {/* Right Side */}
                <div className="space-y-6 lg:col-span-2">
                    <PersonalInformation />
                    <SecuritySection />
                </div>
            </div>
        </div>
    );
}