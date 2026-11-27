export const contractDurationUnits = ["days", "months", "years"] as const;
type DurationUnit = (typeof contractDurationUnits)[number];

export function calculateEndDate(startDate: string, duration: string, unit: DurationUnit) {
  if (!/^\d+$/.test(duration.trim())) return "";
  const amount = Number(duration);
  if (!startDate || !Number.isSafeInteger(amount) || amount < 1) return "";
  const start = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return "";
  const end = new Date(start);

  if (unit === "days") {
    end.setUTCDate(start.getUTCDate() + amount - 1);
  } else {
    // Calendar terms include their final day; short months clamp to their last day.
    end.setUTCDate(1);
    end.setUTCMonth(start.getUTCMonth() + amount * (unit === "years" ? 12 : 1));
    const lastDay = new Date(end);
    lastDay.setUTCMonth(end.getUTCMonth() + 1, 0);
    end.setUTCDate(Math.min(start.getUTCDate() - 1, lastDay.getUTCDate()));
  }

  if (Number.isNaN(end.getTime()) || end.getUTCFullYear() < 1 || end.getUTCFullYear() > 9999) return "";
  return end.toISOString().slice(0, 10);
}
