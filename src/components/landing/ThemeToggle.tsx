import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative h-9 w-16 rounded-full border border-border bg-secondary/60 backdrop-blur transition-colors hover:bg-secondary"
    >
      <motion.div
        className="absolute top-1 flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-white shadow-soft"
        animate={{ x: isDark ? 32 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.div>
      </motion.div>
    </button>
  );
}
