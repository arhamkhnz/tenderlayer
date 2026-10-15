import colors from "tailwindcss/colors";

// Read every family from Tailwind rather than maintaining a separate palette.
const avatarFamilies = Object.values(colors).flatMap((family) =>
  typeof family === "object" && "500" in family ? [family] : [],
);

export function getAvatarColors(name: string) {
  const normalizedName = name.trim().replace(/\s+/g, " ").toLowerCase();
  let hash = 2166136261;

  for (const character of normalizedName) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }

  const family = avatarFamilies[(hash >>> 0) % avatarFamilies.length]!;

  return {
    light: { background: family[700], outline: family[800], foreground: family[50] },
    dark: { background: family[900], outline: family[700], foreground: family[200] },
  };
}
