"use client";

import { usePathname } from "next/navigation";
import SplashCursor from "./SplashCursor";

const WORKSPACE_PREFIXES = ["/organizer", "/mentor", "/student", "/judge"];

export function SplashCursorGate() {
  const pathname = usePathname();
  const isWorkspace = WORKSPACE_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (isWorkspace) return null;

  return (
    <SplashCursor
      COLOR="#ff7a00"
      RAINBOW_MODE={false}
      SPLAT_RADIUS={0.16}
      SPLAT_FORCE={5200}
      DYE_RESOLUTION={1024}
      BACK_COLOR={{ r: 0, g: 0, b: 0 }}
      TRANSPARENT
    />
  );
}
