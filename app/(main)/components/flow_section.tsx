import { UserPlus, Users, FileCheck, MessageSquare, Trophy, Award } from 'lucide-react';

export default function CompetitionFlowSection() {
    const steps = [
        {
            icon: UserPlus,
            title: 'Registration',
            description: 'Sign up individually and create your profile'
        },
        {
            icon: Users,
            title: 'Team Formation',
            description: 'Form teams of 3-5 members before deadline'
        },
        {
            icon: FileCheck,
            title: 'Qualification Round',
            description: 'Submit initial project prototype for review'
        },
        {
            icon: MessageSquare,
            title: 'Mentoring',
            description: 'Get guidance from industry experts'
        },
        {
            icon: Trophy,
            title: 'Final Round',
            description: 'Present complete solution to judges'
        },
        {
            icon: Award,
            title: 'Awards Ceremony',
            description: 'Winners announced and prizes awarded'
        },
    ];

    return (
        <section className="relative overflow-hidden bg-background py-24">
            {/* Background Glow */}
            <div className="absolute left-1/2 top-1/2 h-full w-full max-w-5xl -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-500/10 to-orange-500/5 blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <div className="mb-20 text-center">
                    <h2 className="mb-4 text-4xl font-black md:text-5xl">
                        <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Competition Flow
                        </span>
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        Your journey from registration to
                        victory
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative mx-auto max-w-7xl">
                    {/* Connection Line */}
                    <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-orange-500/10 via-orange-500 to-orange-500/10 lg:block" />

                    {/* Steps */}
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={index}
                                    className="group relative flex flex-col items-center text-center"
                                >
                                    {/* Icon Area */}
                                    <div className="relative mb-6">
                                        {/* Glow */}
                                        <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-30" />

                                        {/* Icon Box */}
                                        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-2xl shadow-orange-500/25 transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="text-4xl text-white" />
                                        </div>

                                        {/* Step Number */}
                                        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-500 bg-background text-sm font-bold text-foreground shadow-lg">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm leading-7 text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
