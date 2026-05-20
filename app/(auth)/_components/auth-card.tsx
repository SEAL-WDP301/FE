import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-sm rounded-[3.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(92,49,23,0.9),rgba(27,15,10,0.96))] px-5 py-6 shadow-[0_0_80px_rgba(255,112,34,0.14),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur sm:max-w-md sm:px-8 sm:py-8 md:max-w-lg md:px-10 md:py-10",
        className
      )}
    >
      {children}
    </section>
  );
}

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <header>
      <p className="text-xs font-medium uppercase tracking-[0.45em] text-[#ff7629] sm:text-sm">
        SEAL · ACCESS
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-normal text-white sm:text-3xl md:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-xs leading-5 text-[#b9aaa2] sm:text-sm md:text-base">
        {subtitle}
      </p>
    </header>
  );
}

type AuthFooterLinkProps = {
  label: string;
  href: string;
  action: string;
};

export function AuthFooterLink({ label, href, action }: AuthFooterLinkProps) {
  return (
    <p className="text-center text-xs text-[#b9aaa2] sm:text-sm">
      {label}{" "}
      <Link href={href} className="font-semibold text-[#ff7629]">
        {action}
      </Link>
    </p>
  );
}

export function AuthDivider() {
  return (
    <div className="relative flex items-center">
      <div className="h-px flex-1 bg-white/15" />
      <span className="bg-[#21120c] px-5 text-sm uppercase tracking-[0.35em] text-[#b9aaa2] sm:text-base">
        Or continue with
      </span>
      <div className="h-px flex-1 bg-white/15" />
    </div>
  );
}
