import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({
  size = "md",
  showText = true,
}: LogoProps) {
  const sizes = {
    sm: {
      wrapper: "h-9 w-9",
      text: "text-lg",
      title: "text-lg",
      subtitle: "text-[9px]",
    },
    md: {
      wrapper: "h-11 w-11",
      text: "text-xl",
      title: "text-xl",
      subtitle: "text-[10px]",
    },
    lg: {
      wrapper: "h-14 w-14",
      text: "text-2xl",
      title: "text-2xl",
      subtitle: "text-xs",
    },
  };

  const current = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5">
      {/* Circle Logo */}
      <div
        className={`flex ${current.wrapper} items-center justify-center rounded-full border border-orange-400/30 bg-gradient-to-br from-orange-500 to-orange-400 shadow-lg shadow-orange-500/20`}
      >
        <span className={`${current.text} font-bold text-black`}>
          S
        </span>
      </div>

      {/* Text */}
      {showText && (
        <div className="leading-tight">
          <h1
            className={`${current.title} font-bold tracking-tight text-foreground`}
          >
            SEAL
          </h1>

          <p
            className={`${current.subtitle} font-medium tracking-[0.3em] text-orange-400`}
          >
            FPTU · HCMC
          </p>
        </div>
      )}
    </Link>
  );
}