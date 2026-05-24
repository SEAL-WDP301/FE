import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navigation() {

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Events', href: '#events' },
        { label: 'Rankings', href: '#rankings' },
        { label: 'Categories', href: '#categories' },
        { label: 'About', href: '#about' },
        { label: 'FAQ', href: '#FAQ'}
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-orange-500/10 bg-black/80 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    {/* Circle Logo */}
                    <Link href={"/"}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-400/30 bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/20">
                            <span className="text-xl font-bold text-black">S</span>
                        </div>
                    </Link>
                    {/* Text */}
                    <div className="leading-tight">
                        <h1 className="text-x1 font-bold tracking-tight text-white">
                            SEAL
                        </h1>

                        <p className="text-[10px] font-medium tracking-[0.3em] text-orange-400">
                            FPTU · HCMC
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-xl lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group relative rounded-full px-5 py-2 text-sm font-medium text-zinc-400 transition-all duration-300 hover:text-white"
                        >
                            {/* Hover Background */}
                            <span className="absolute inset-0 rounded-full bg-orange-500/0 transition-all duration-300 group-hover:bg-orange-500/10" />

                            {/* Text */}
                            <span className="relative z-10">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className='text-sm text-muted-foreground hover:text-white'>
                        Login
                    </Button>

                    <Button size="sm" className="px-6">
                        Register
                    </Button>
                </div>
            </nav>
        </header>
    );
}