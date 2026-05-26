import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium cursor-pointer",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

        orange:
          "bg-gradient-to-b from-[#FF8A3D] to-[#F37021] text-black shadow-sm hover:brightness-110 hover:-translate-y-0.5",

        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",

        outline:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground",

        glass:
          "border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10",

        soft:
          "bg-primary/10 text-primary hover:bg-primary/20",

        link:
          "h-auto p-0 text-primary underline-offset-4 hover:underline",

        authPrimary:
          "rounded-[2rem] bg-[linear-gradient(180deg,#ff873f,#ff6f22)] text-black shadow-[0_18px_50px_rgba(255,112,34,0.28)] hover:brightness-110 focus-visible:ring-4 focus-visible:ring-[#ff7629]/30 active:translate-y-px",

        authSecondary:
          "rounded-[2rem] border border-white/15 bg-white/[0.025] text-white hover:border-[#ff7629]/50 hover:bg-white/[0.05] focus-visible:ring-4 focus-visible:ring-[#ff7629]/20 active:translate-y-px",

        subtleIcon:
          "text-[#aa9b93] hover:text-[#ff7629]",

        eventTab:
          "rounded-2xl text-[#8E827C] hover:bg-white/[0.02] hover:text-white",

        eventTabActive:
          "rounded-2xl border border-[#FF6B2C]/30 bg-[#1A1512] text-[#FF6B2C] shadow-[0_4px_20px_rgba(255,107,44,0.08)]",

        eventCta:
          "rounded-2xl bg-[#FF6B2C] text-white uppercase tracking-wider shadow-lg shadow-[#FF6B2C]/10 hover:bg-[#ff7b42]",

        eventOutline:
          "rounded-2xl border border-white/[0.06] text-[#A39690] hover:bg-white/[0.02] hover:text-white",

        eventBack:
          "group rounded-xl border border-white/[0.06] bg-white/[0.02] text-[#A39690] hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white active:scale-[0.98]",

        dashboardIcon:
          "rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",

        socialIcon:
          "rounded-xl bg-zinc-800 text-zinc-400 hover:bg-orange-500 hover:text-white",

        seasonGradient:
          "rounded-xl text-white hover:gap-3 hover:shadow-xl",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        "icon-sm": "h-8 w-8",
        icon: "h-9 w-9",
        auth: "h-11 px-6 text-sm",
        eventTab: "px-7 py-4 text-lg",
        eventCta: "py-3.5 px-6 text-sm",
        eventBack: "px-4 py-2 text-xs",
        dashboardIcon: "h-11 w-11",
        socialIcon: "h-9 w-9",
        auto: "h-auto",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
