export function getInitials(name: string, count: 1 | 2 = 2): string {
  return (name.match(/\S+/gu) ?? [])
    .slice(0, count)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
}
