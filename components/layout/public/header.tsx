import Link from 'next/link';

export default function Header() {

    const navItems = [
        {
            label: 'Home',
            href: '#home',
        },
        {
            label: 'Events',
            href: '#events',
        },
        {
            label: 'Categories',
            href: '#categories',
        },
        {
            label: 'Rankings',
            href: '#rankings',
        },
        {
            label: 'About',
            href: '#about',
        },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-orange-500/20 bg-black/70 backdrop-blur-xl">
            {/* Glow line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/25">
                            <span className="text-xl font-bold text-white">
                                S
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-white">
                                SEAL
                            </h1>

                            <p className="text-xs text-zinc-400">
                                FPT University
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group relative text-sm text-zinc-400 transition-colors duration-300 hover:text-orange-500"
                            >
                                {item.label}

                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}

                        {/* Login */}
                        <button className="text-sm text-zinc-400 transition-colors hover:text-white">
                            Login
                        </button>

                        {/* Register */}
                        <button className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30">
                            Register
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}