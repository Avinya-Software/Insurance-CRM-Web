import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

/** Mouse-follow glow — visible primarily in dark mode. */
export function CursorGlow() {
  const { theme } = useTheme();
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (theme !== "dark") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      style={{
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, oklch(0.62 0.22 264 / 0.15), transparent 60%)`,
      }}
    />
  );
}
