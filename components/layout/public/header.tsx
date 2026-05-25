"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navigation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return null;
            const res = await axiosClient.get('/users/profile');
            return res.data?.data;
        },
    });

    useEffect(() => {
        const handleUnauthorized = () => {
            queryClient.setQueryData(['userProfile'], null);
        };
        window.addEventListener('auth-unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
    }, [queryClient]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        queryClient.setQueryData(['userProfile'], null);
        enqueueSnackbar('Đăng xuất thành công!', { variant: 'info' });
        router.push('/');
    };

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Events', href: '#events' },
        { label: 'Rankings', href: '#rankings' },
        { label: 'Categories', href: '#categories' },
        { label: 'About', href: '#about' },
        { label: 'FAQ', href: '#FAQ' }
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-orange-500/10 bg-black/80 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* Logo */}
                <Logo size='sm' />

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
                    {isLoading ? (
                        <div className="h-9 w-20 animate-pulse rounded-md bg-white/10" />
                    ) : user && !isError ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden flex-col items-end sm:flex">
                                <span className="text-sm font-semibold text-white">{user.name}</span>
                                <span className="text-xs text-[#b9aaa2]">{user.email}</span>
                            </div>
                            <Avatar className="h-9 w-9 ring-2 ring-orange-500/30">
                                {user.avatarUrl ? (
                                    <AvatarImage
                                        src={user.avatarUrl}
                                        alt={user.name}
                                    />
                                ) : null}

                                <AvatarFallback>
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300">
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href={"/login"}>
                                <Button variant="ghost" size="sm" className='text-sm text-muted-foreground hover:text-white'>
                                    Login
                                </Button>
                            </Link>
                            <Link href={"/register"}>
                                <Button size="sm" className="px-6">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}