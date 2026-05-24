"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthCard, AuthFooterLink, AuthHeader } from "../_components/auth-card";
import {
  AuthField,
  AuthTextarea,
  PrimaryButton,
  SecondaryButton,
} from "../_components/auth-controls";
import { Button } from "@/components/ui/button";

const skills = ["React", "TypeScript", "Python", "Go", "AI/ML", "Figma", "Rust", "Node"];

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [studentType, setStudentType] = useState<"fpt" | "external">("fpt");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Node"]);

  const stepTitle = useMemo(() => {
    if (step === 1) return "Step 01 · Account";
    if (step === 2) return "Step 02 · Student";
    if (step === 3) return "Step 03 · Profile";
    return "Step 03 · Profile";
  }, [step]);

  function nextStep() {
    setStep((current) => Math.min(current + 1, 3));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <AuthCard>
      <div className="space-y-5">
        <AuthHeader
          title="Create your account"
          subtitle="Three short steps to enter the league."
        />

        <StepProgress activeStep={step} />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-xs font-medium uppercase tracking-[0.42em] text-[#ff7629] sm:text-sm">
            {stepTitle}
          </p>

          {step === 1 ? (
            <AccountStep />
          ) : null}
          {step === 2 ? (
            <StudentStep
              studentType={studentType}
              setStudentType={setStudentType}
            />
          ) : null}
          {step === 3 ? (
            <ProfileStep
              selectedSkills={selectedSkills}
              toggleSkill={toggleSkill}
            />
          ) : null}

          {step > 1 ? (
            <div className="grid gap-3 pt-2 sm:grid-cols-[9rem_1fr]">
              <SecondaryButton type="button" onClick={previousStep}>
                <ArrowLeft className="size-4" />
                Back
              </SecondaryButton>

              <PrimaryButton
                type={step === 3 ? "submit" : "button"}
                onClick={step === 3 ? undefined : nextStep}
              >
                {step === 3 ? "Create Account" : "Continue"}{" "}
                <ArrowRight className="size-4" />
              </PrimaryButton>
            </div>
          ) : (
            <div className="pt-2 flex justify-center">
              <PrimaryButton
                className="w-48 sm:w-auto"
                type={step === 3 ? "submit" : "button"}
                onClick={step === 3 ? undefined : nextStep}
              >
                {step === 3 ? "Create Account" : "Continue"}{" "}
                <ArrowRight className="size-4" />
              </PrimaryButton>
            </div>
          )}
        </form>

        <AuthFooterLink
          label="Already a hacker?"
          href="/login"
          action="Login"
        />
      </div>
    </AuthCard>
  );
}

function StepProgress({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center gap-3 py-2 sm:gap-4">
      {[1, 2, 3].map((item) => {
        const complete = activeStep > item;
        const active = activeStep === item;

        return (
          <div key={item} className="flex flex-1 items-center last:flex-none">
            <span
              className={cn(
                "grid size-10 place-items-center rounded-full border border-white/15 text-sm font-bold text-[#b9aaa2] sm:size-12 sm:text-base",
                (active || complete) &&
                "border-[#ff7629] bg-[linear-gradient(180deg,#ff873f,#ff6f22)] text-black shadow-[0_0_30px_rgba(255,112,34,0.25)]"
              )}
            >
              {complete ? <Check className="size-5" /> : item}
            </span>
            {item < 3 ? (
              <span
                className={cn(
                  "mx-4 h-px flex-1 bg-white/15 sm:mx-6",
                  activeStep > item && "bg-[#ff7629]"
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function AccountStep() {
  return (
    <div className="space-y-4">
      <AuthField label="Full name" placeholder="Nguyen Minh Khoa" autoComplete="name" />
      <AuthField
        label="Email"
        type="email"
        placeholder="you@fpt.edu.vn"
        autoComplete="email"
      />
      <div className="space-y-3">
        <AuthField
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <input
          type="text"
          placeholder="Type to test strength"
          className="h-10 w-full rounded-[2rem] border border-white/15 bg-white/[0.045] px-4 text-sm text-white outline-none placeholder:text-[#8f817a] focus:border-[#ff7629]/70 focus:ring-4 focus:ring-[#ff7629]/15"
        />
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="grid grid-cols-4 gap-1.5">
            <span className="h-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 rounded-full bg-white/15" />
          </div>
          <span className="text-xs text-[#b9aaa2]">Too short</span>
        </div>
      </div>
      <AuthField
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
      />

    </div>
  );
}

function StudentStep({
  studentType,
  setStudentType,
}: {
  studentType: "fpt" | "external";
  setStudentType: (value: "fpt" | "external") => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <StudentChoice
          active={studentType === "fpt"}
          title="FPT Student"
          subtitle="FPTU HCMC / HN / DN"
          onClick={() => setStudentType("fpt")}
        />
        <StudentChoice
          active={studentType === "external"}
          title="External Student"
          subtitle="Other universities"
          onClick={() => setStudentType("external")}
        />
      </div>
      <AuthField
        label={studentType === "fpt" ? "Student ID" : "University"}
        placeholder={studentType === "fpt" ? "SE181234" : "University name"}
      />
    </div>
  );
}

function StudentChoice({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[1.75rem] border border-white/15 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#ff7629]/60",
        active &&
        "border-[#ff7629] shadow-[0_0_32px_rgba(255,112,34,0.18),inset_0_0_0_1px_rgba(255,112,34,0.35)]"
      )}
    >
      <span className="block text-lg font-bold text-white">{title}</span>
      <span className="mt-1.5 block text-xs text-[#b9aaa2]">{subtitle}</span>
    </button>
  );
}

function ProfileStep({
  selectedSkills,
  toggleSkill,
}: {
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="grid size-20 shrink-0 cursor-pointer place-items-center rounded-[1.5rem] bg-[linear-gradient(180deg,#ff873f,#ff6f22)] text-black">
          <Plus className="size-7 stroke-[3]" />
          <input type="file" accept="image/png,image/jpeg" className="sr-only" />
        </label>
        <div>
          <h2 className="text-lg font-bold text-white">Upload avatar</h2>
          <p className="mt-1 text-xs text-[#b9aaa2]">PNG or JPG · max 2MB</p>
          <label className="mt-2 inline-flex h-9 cursor-pointer items-center rounded-full border border-white/15 px-4 text-xs text-white transition hover:border-[#ff7629]/60">
            Choose file
            <input type="file" accept="image/png,image/jpeg" className="sr-only" />
          </label>
        </div>
      </div>

      <AuthTextarea label="Bio" placeholder="Tell the league who you are..." />

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#b9aaa2] sm:text-sm">
          Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const selected = selectedSkills.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.025] px-4 text-xs text-white transition hover:border-[#ff7629]/60",
                  selected && "border-[#ff7629] bg-[#ff7629]/10"
                )}
              >
                <Plus className="size-3" />
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only">
        <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
