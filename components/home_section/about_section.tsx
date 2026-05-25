import { Building2, Users, Target, Award } from 'lucide-react';

export default function AboutSealSection() {
    const features = [
        {
            icon: Building2,
            title: 'University Collaboration',
            description: 'Organized by Software Engineering Department in partnership with PDP at FPT University HCMC'
        },
        {
            icon: Users,
            title: 'Multi-University Participation',
            description: 'Open to FPT students, mixed teams, and partner university teams from across Vietnam'
        },
        {
            icon: Target,
            title: 'Multiple Competition Rounds',
            description: 'Progress through Qualification, Semi-final, and Final rounds with increasing challenges'
        },
        {
            icon: Award,
            title: 'Industry Recognition',
            description: 'Gain exposure to tech companies and build your professional network'
        },
    ];

    const timeline = [
        {
            season: 'Spring',
            month: 'Mar - Apr',
            status: 'Innovation Challenge',
        },

        {
            season: 'Summer',
            month: 'Jun - Jul',
            status: 'Intensive Hackathon',
        },

        {
            season: 'Fall',
            month: 'Sep - Oct',
            status: 'Championship Finale',
        },
    ];

    return (
        <section className="relative overflow-hidden bg-black py-24">
            {/* Background Glow */}
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* LEFT */}
                    <div>
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 backdrop-blur-xl">
                            <span className="text-sm font-medium text-orange-500">
                                About SEAL
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
                            <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                                Software Engineering Excellence
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mb-10 text-lg leading-8 text-zinc-400">
                            SEAL (Software Engineering Agile League)
                            is an annual academic hackathon series
                            that brings together talented students
                            from FPT University and partner
                            institutions to tackle real-world
                            software engineering challenges through
                            innovation and collaboration.
                        </p>

                        {/* Features */}
                        <div className="space-y-5">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;

                                return (
                                    <div
                                        key={index}
                                        className="group flex gap-4 rounded-2xl border border-orange-500/10 bg-zinc-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/30 hover:bg-zinc-900/60"
                                    >
                                        {/* Icon */}
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="text-xl text-white" />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-white">
                                                {feature.title}
                                            </h3>

                                            <p className="text-sm leading-7 text-zinc-400">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-zinc-900/50 p-8 backdrop-blur-xl">
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

                            {/* Glow */}
                            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-orange-500/10 blur-[100px]" />

                            <div className="relative z-10">
                                {/* Title */}
                                <h3 className="mb-10 text-3xl font-bold text-white">
                                    Annual SEAL Cycle
                                </h3>

                                {/* Timeline */}
                                <div className="space-y-8">
                                    {timeline.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-5"
                                        >
                                            {/* Number */}
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/25">
                                                <span className="text-lg font-bold text-white">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <h4 className="text-xl font-semibold text-white">
                                                        SEAL {item.season}
                                                    </h4>

                                                    <span className="text-sm text-zinc-500">
                                                        {item.month}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-zinc-400">
                                                    {item.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
