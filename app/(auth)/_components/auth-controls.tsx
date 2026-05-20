import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  icon?: ReactNode;
};

export function AuthField({ label, icon, className, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#b9aaa2] sm:text-sm">
        {label}
      </span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aa9b93]">
            {icon}
          </span>
        ) : null}
        <input
          className={cn(
            "h-11 w-full rounded-[2rem] border border-white/15 bg-white/[0.045] px-4 text-sm text-white outline-none transition placeholder:text-[#8f817a] focus:border-[#ff7629]/70 focus:ring-4 focus:ring-[#ff7629]/15",
            icon && "pl-12",
            className
          )}
          {...props}
        />
      </span>
    </label>
  );
}

type TextAreaProps = ComponentProps<"textarea"> & {
  label: string;
};

export function AuthTextarea({ label, className, ...props }: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#b9aaa2] sm:text-sm">
        {label}
      </span>
      <textarea
        className={cn(
          "min-h-24 w-full resize-none rounded-[1.75rem] border border-white/15 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#8f817a] focus:border-[#ff7629]/70 focus:ring-4 focus:ring-[#ff7629]/15",
          className
        )}
        {...props}
      />
    </label>
  );
}

type PrimaryButtonProps = ComponentProps<"button">;

export function PrimaryButton({ className, ...props }: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-[2rem] bg-[linear-gradient(180deg,#ff873f,#ff6f22)] px-6 text-sm font-bold text-black shadow-[0_18px_50px_rgba(255,112,34,0.28)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#ff7629]/30 active:translate-y-px",
        className
      )}
      {...props}
    />
  );
}

type SecondaryButtonProps = ComponentProps<"button">;

export function SecondaryButton({ className, ...props }: SecondaryButtonProps) {
  return (
    <button
      className={cn(
        "flex h-11 items-center justify-center gap-2 rounded-[2rem] border border-white/15 bg-white/[0.025] px-6 text-sm font-medium text-white transition hover:border-[#ff7629]/50 hover:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-[#ff7629]/20 active:translate-y-px",
        className
      )}
      {...props}
    />
  );
}
