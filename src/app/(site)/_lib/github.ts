const GITHUB = {
  org: "arhamkhnz",
  repo: "tenderlayer",
} as const;

export async function getStargazerCount() {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB.org}/${GITHUB.repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return 0;
    }

    const json = (await response.json()) as { stargazers_count?: number };
    return Number(json.stargazers_count) || 0;
  } catch {
    return 0;
  }
}
