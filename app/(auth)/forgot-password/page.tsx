import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { AuthCard, AuthFooterLink, AuthHeader } from "../_components/auth-card";
import { AuthField, PrimaryButton, SecondaryButton } from "../_components/auth-controls";

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <div className="space-y-5">
        <AuthHeader
          title="Reset password"
          subtitle="Enter your account email and we will send reset instructions."
        />

        <form className="space-y-4">
          <AuthField
            label="Email"
            type="email"
            placeholder="you@fpt.edu.vn"
            autoComplete="email"
            icon={<Mail className="size-4" />}
          />

          <PrimaryButton type="submit">
            Send reset link <ArrowRight className="size-4" />
          </PrimaryButton>
        </form>

        <Link href="/login" className="block">
          <SecondaryButton type="button" className="mx-auto w-full sm:w-auto">
            <ArrowLeft className="size-4" />
            Back to login
          </SecondaryButton>
        </Link>

        <AuthFooterLink
          label="Don't have an account?"
          href="/register"
          action="Register"
        />
      </div>
    </AuthCard>
  );
}
