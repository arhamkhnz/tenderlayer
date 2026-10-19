const compactNumberFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  compactDisplay: "long",
  maximumFractionDigits: 1,
});

export function formatCompactNumber(value: number): string {
  return compactNumberFormatter
    .formatToParts(value)
    .map((part) => (part.type === "compact" ? ` ${part.value}` : part.value))
    .join("")
    .replace(/\s+/gu, " ");
}

export function getInitials(name: string, count: 1 | 2 = 2): string {
  return (name.match(/\S+/gu) ?? [])
    .slice(0, count)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
}
