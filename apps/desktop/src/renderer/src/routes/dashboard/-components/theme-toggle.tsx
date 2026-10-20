import { MonitorIcon, MoonIcon, SunIcon } from "@keyline-icons/react";
import { Button } from "@tenderlayer/ui/components/button";
import { usePreferences } from "@/app/preferences";

const themeCycle = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, isDark, setTheme } = usePreferences();
  const nextTheme = themeCycle[(themeCycle.indexOf(theme) + 1) % themeCycle.length] ?? "light";
  const ThemeIcon = theme === "system" ? MonitorIcon : isDark ? SunIcon : MoonIcon;

  function toggleTheme() {
    void setTheme(nextTheme);
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Switch to ${nextTheme} theme`}
      title={`Current theme: ${theme}. Switch to ${nextTheme} theme`}
      className="[app-region:no-drag] [-webkit-app-region:no-drag]"
    >
      <ThemeIcon aria-hidden="true" />
    </Button>
  );
}
