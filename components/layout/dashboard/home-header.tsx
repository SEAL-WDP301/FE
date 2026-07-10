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
import { LayoutDashboard } from 'lucide-react';
import { getRoleHomePath } from '@/components/auth/role-guard';
import { InvitationsMenu } from './invitations-menu';
import { NotificationsMenu } from './notifications-menu';
import { useAuthStore } from '@/lib/stores/auth.store';

// ORGANIZER_MENUS removed per user request

export default function HomeHeader({ customCenterContent }: { customCenterContent?: React.ReactNode } = {}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const token = useAuthStore.getState().accessToken;
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
        useAuthStore.getState().clearAccessToken();
        queryClient.setQueryData(['userProfile'], null);
        enqueueSnackbar('Đăng xuất thành công!', { variant: 'info' });
        router.push('/');
    };
    
    const rawAvatarUrl = user?.avatarUrl;
    const avatarUrl = typeof rawAvatarUrl === 'string' ? rawAvatarUrl.trim() : '';
    const getProfileHref = () => {
        const role = user?.role?.toLowerCase();
        if (role === 'student') return '/student/profile';
        if (role === 'judge') return '/judge/profile';
        if (role === 'stakeholder') return '/mentor/profile';
        if (role === 'admin' || role === 'organizer') return '/organizer/profile';
        return '/home';
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Logo size='sm' href="/home" />

                {/* Center Navigation */}
                {customCenterContent ? (
                    <div className="flex flex-1 items-center justify-center overflow-x-auto mx-2 md:mx-4 scrollbar-none">
                        {customCenterContent}
                    </div>
                ) : null}

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
                    ) : user && !isError ? (
                        <div className="flex items-center gap-3">
                            {user.role === 'student' && <InvitationsMenu />}
                            <NotificationsMenu />
                            
                            <ThemeToggle />
                            {(user.role === 'admin' || user.role === 'organizer') && (
                                <Button
                                    asChild
                                    variant="soft"
                                    size="sm"
                                    className="hidden sm:flex h-9 rounded-full px-3 text-primary hover:bg-primary/15"
                                >
                                    <Link href={getRoleHomePath(user.role)}>
                                        <LayoutDashboard className="size-4 mr-1.5" />
                                        <span>Dashboard</span>
                                    </Link>
                                </Button>
                            )}
                            <div className="hidden flex-col items-end sm:flex pl-2">
                                <span className="text-sm font-semibold text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                            <Link href={getProfileHref()} className="cursor-pointer transition-transform hover:scale-105">
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
                            </Link>

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
