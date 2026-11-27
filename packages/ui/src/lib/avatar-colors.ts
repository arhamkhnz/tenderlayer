import colors from "tailwindcss/colors";

// Read every family from Tailwind rather than maintaining a separate palette.
const colorFamilies = Object.values(colors).flatMap((family) =>
  typeof family === "object" && "500" in family ? [family] : [],
);

function getColorFamily(seed: string) {
  const normalizedSeed = seed.trim().replace(/\s+/g, " ").toLowerCase();
  let hash = 2166136261;

  for (const character of normalizedSeed) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }

  return colorFamilies[(hash >>> 0) % colorFamilies.length]!;
}

export function getAvatarColors(name: string) {
  const family = getColorFamily(name);
  return {
    light: { background: family[700], outline: family[800], foreground: family[50] },
    dark: { background: family[900], outline: family[700], foreground: family[200] },
  };
}

export function getBadgeColors(seed: string) {
  const family = getColorFamily(seed);
  return {
    light: { background: family[100], foreground: family[800] },
    dark: { background: family[900], foreground: family[200] },
  };
}
