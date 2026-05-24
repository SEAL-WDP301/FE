import Link from "next/link";
import { ArrowRight, Check, Mail, Shield } from "lucide-react";

import {
  AuthCard,
  AuthDivider,
  AuthFooterLink,
  AuthHeader,
} from "../_components/auth-card";
import { AuthField, PrimaryButton, SecondaryButton } from "../_components/auth-controls";

export default function LoginPage() {
  return (
    <AuthCard>
      <div className="space-y-5">
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue to the SEAL command center."
        />

        <form className="space-y-4">
          <AuthField
            label="Email"
            type="email"
            placeholder="you@fpt.edu.vn"
            autoComplete="email"
            icon={<Mail className="size-4" />}
          />
          <AuthField
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Shield className="size-4" />}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#b9aaa2] sm:text-sm">
            <label className="flex items-center gap-3">
              <span className="grid size-5 place-items-center rounded-md border border-white/20 bg-white/[0.03] text-[#ff7629]">
                <Check className="size-4" />
              </span>
              Remember me
            </label>
            <Link href="/forgot-password" className="hover:text-[#ff7629]">
              Forgot password?
            </Link>
          </div>

          <PrimaryButton type="submit">
            Login <ArrowRight className="size-4" />
          </PrimaryButton>
        </form>

        <AuthDivider />

        <div className="grid gap-2 sm:grid-cols-2">
          <SecondaryButton type="button">
            <span className="text-lg font-semibold">G</span>
            Google
          </SecondaryButton>
          <SecondaryButton type="button">
            <span className="size-4 rounded-full border-[0.4rem] border-white" />
            GitHub
          </SecondaryButton>
        </div>

        <AuthFooterLink
          label="Don't have an account?"
          href="/register"
          action="Register"
        />
      </div>
    </AuthCard>
  );
}
