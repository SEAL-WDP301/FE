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


    return (
        <section className="relative overflow-hidden bg-background py-24">
            {/* Background Glow */}
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="w-full">
                    <div>
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 backdrop-blur-xl">
                            <span className="text-sm font-medium text-orange-500">
                                About SEAL
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
                            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Software Engineering Excellence
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mb-10 max-w-5xl text-lg leading-8 text-muted-foreground">
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
                                        className="group flex gap-4 rounded-2xl border border-border bg-card p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/30 hover:bg-muted/60"
                                    >
                                        {/* Icon */}
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="text-xl text-foreground" />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                                {feature.title}
                                            </h3>

                                            <p className="text-sm leading-7 text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
