import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export default function JudgesSection() {
    const judges = [
        {
            name: 'Dr. Sarah Chen',
            role: 'Chief AI Officer',
            company: 'TechCorp',
            expertise: 'Machine Learning, AI',

            image:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },

        {
            name: 'Michael Rodriguez',
            role: 'VP of Engineering',
            company: 'StartupX',
            expertise: 'Full-Stack Development',

            image:
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },

        {
            name: 'Emily Watson',
            role: 'Mobile Lead',
            company: 'AppFlow',
            expertise: 'iOS, Android',

            image:
                'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },

        {
            name: 'David Kim',
            role: 'Security Expert',
            company: 'CyberShield',
            expertise: 'Cybersecurity, Blockchain',

            image:
                'https://images.unsplash.com/photo-1676989880361-091e12efc056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },

        {
            name: 'Jennifer Park',
            role: 'Design Director',
            company: 'CreativeHub',
            expertise: 'UI/UX, Product Design',

            image:
                'https://images.unsplash.com/photo-1614786269829-d24616faf56d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },

        {
            name: 'Alex Zhang',
            role: 'IoT Specialist',
            company: 'SmartDevices Inc',
            expertise: 'Hardware, Embedded Systems',

            image:
                'https://images.unsplash.com/photo-1718209881007-c0ecdfc00f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },
    ];

    const mentors = [
        {
            name: 'Rachel Green',
            role: 'Senior Developer',
            company: 'DevHub',
            expertise: 'React, Node.js',

            image:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },

        {
            name: 'James Wilson',
            role: 'Cloud Architect',
            company: 'CloudTech',
            expertise: 'AWS, DevOps',

            image:
                'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        },
    ];

    type Person = {
        name: string;
        role: string;
        company: string;
        expertise: string;
        image: string;
    };

    const PersonCard = ({
        person,
    }: {
        person: Person;
    }) => {
        return (
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top Accent */}
                <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                    {/* Avatar */}
                    <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-2xl ring-2 ring-orange-500/20 transition-all duration-300 group-hover:ring-orange-500/50">
                        <Image
                            src={person.image}
                            alt={person.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                        />
                    </div>

                    {/* Name */}
                    <h3 className="mb-1 text-xl font-bold text-foreground">
                        {person.name}
                    </h3>

                    {/* Role */}
                    <p className="text-sm text-muted-foreground">
                        {person.role}
                    </p>

                    {/* Company */}
                    <p className="mb-4 text-sm text-orange-400">
                        {person.company}
                    </p>

                    {/* Expertise */}
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            Expertise:
                        </span>

                        <span className="rounded-xl bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                            {person.expertise}
                        </span>
                    </div>

                    {/* Social */}
                    <div className="flex gap-3">
                        <Button variant="socialIcon" size="socialIcon">
                            <FaLinkedin />
                        </Button>

                        <Button variant="socialIcon" size="socialIcon">
                            <FaTwitter />
                        </Button>

                        <Button variant="socialIcon" size="socialIcon">
                            <FaGithub />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="relative overflow-hidden bg-background py-24">
            {/* Background Glow */}
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[150px]" />

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-black md:text-5xl">
                        <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Judges
                        </span>
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        Industry experts and experienced professionals
                    </p>
                </div>

                {/* Judges */}
                <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {judges.map((judge) => (
                        <PersonCard
                            key={judge.name}
                            person={judge}
                        />
                    ))}
                </div>

                {/* Mentors Title */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-black md:text-5xl">
                        <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Mentors
                        </span>
                    </h2>

                    <p className="text-lg text-muted-foreground">
                        Dedicated experts provide guidance.
                    </p>
                </div>

                {/* Mentors */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {mentors.map((mentor) => (
                        <PersonCard
                            key={mentor.name}
                            person={mentor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
