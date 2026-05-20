import { Code2, Zap, Users, Trophy } from 'lucide-react';

export default function HeroSection() {
    const stats = [
        {
            icon: Users,
            label: 'Active Teams',
            value: '150+',
        },
        {
            icon: Trophy,
            label: 'Prize Pool',
            value: '₫50M',
        },
        {
            icon: Code2,
            label: 'Projects',
            value: '200+',
        },
        {
            icon: Zap,
            label: 'Universities',
            value: '5+',
        },
    ];

    return (
        <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* Orange Glow */}
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-[140px]" />

            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 py-24">
                <div className="mx-auto max-w-6xl text-center">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 backdrop-blur-xl">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />

                        <span className="text-sm font-medium text-orange-500">
                            Registration Open for SEAL Fall 2026
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
                        <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                            Software Engineering
                        </span>

                        <br />

                        <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                            Agile League
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-4 text-xl text-zinc-300 md:text-2xl">
                        Annual Academic Hackathon Series at FPT
                        University HCMC
                    </p>

                    {/* Description */}
                    <p className="mx-auto mb-12 max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">
                        Compete, innovate, and collaborate with
                        students from FPT University and partner
                        universities through real-world software
                        engineering challenges.
                    </p>

                    {/* Buttons */}
                    <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
                        <button className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30">
                            Explore Events
                        </button>

                        <button className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10">
                            Join Competition
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50"
                                >
                                    {/* Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Icon */}
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-300 shadow-lg shadow-orange-500/20">
                                        <Icon className="text-xl text-white" />
                                    </div>

                                    {/* Value */}
                                    <h3 className="mb-1 text-3xl font-bold text-white">
                                        {stat.value}
                                    </h3>

                                    {/* Label */}
                                    <p className="text-sm text-zinc-400">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}