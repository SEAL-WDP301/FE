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
import { ThemeToggle } from './theme-toggle';

export default function HomeHeader() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return null;
            const res = await axiosClient.get('/users/profile');
            const profile = res.data?.data;
            return profile
                ? { ...profile, avatarUrl: profile.avatarUrl ?? profile.avatar_url }
                : null;
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
    
    const rawAvatarUrl = user?.avatarUrl;
    const avatarUrl = typeof rawAvatarUrl === 'string' ? rawAvatarUrl.trim() : '';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Logo size='sm' href="/home" />

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
                    ) : user && !isError ? (
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <div className="hidden flex-col items-end sm:flex pl-2">
                                <span className="text-sm font-semibold text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                            <Avatar className="h-9 w-9 ring-2 ring-orange-500/30">
                                {avatarUrl ? (
                                    <AvatarImage
                                        key={avatarUrl}
                                        src={avatarUrl}
                                        alt={user.name}
                                        referrerPolicy="no-referrer"
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
                            <ThemeToggle />
                            <Link href={"/login"}>
                                <Button variant="ghost" size="sm" className='text-sm text-muted-foreground hover:text-foreground'>
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
