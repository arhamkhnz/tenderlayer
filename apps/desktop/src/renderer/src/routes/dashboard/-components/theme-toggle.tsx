import { useState } from "react";
import { Button } from "@tenderlayer/ui/components/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  function toggleTheme() {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";
    setIsDark(nextIsDark);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="[app-region:no-drag] [-webkit-app-region:no-drag]"
    >
      Switch to {isDark ? "light" : "dark"} mode
    </Button>
  );
}
