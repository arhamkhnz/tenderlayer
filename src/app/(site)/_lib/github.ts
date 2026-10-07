const GITHUB = { org: "arhamkhnz", repo: "tenderlayer" } as const;

export async function getStargazerCount(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB.org}/${GITHUB.repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) return null;

    const json = (await response.json()) as { stargazers_count?: unknown };
    const count = json.stargazers_count;
    return typeof count === "number" && Number.isSafeInteger(count) && count >= 0 ? count : null;
  } catch {
    return null;
  }
}
