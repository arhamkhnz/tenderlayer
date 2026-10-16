import { Button } from "@tenderlayer/ui/components/button";
import { usePreferences } from "@/app/preferences";

export function ThemeToggle() {
  const { isDark, setTheme } = usePreferences();

  function toggleTheme() {
    void setTheme(isDark ? "light" : "dark");
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
