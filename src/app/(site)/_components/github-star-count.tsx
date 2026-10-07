import { Star } from "@keyline-icons/react";

import { getStargazerCount } from "../_lib/github";

export default async function GitHubStarCount() {
  const starCount = await getStargazerCount();
  if (starCount === null) return null;

  const formattedCount = starCount.toLocaleString("en");

  return (
    <>
      <span className="text-muted text-sm" aria-hidden="true">
        ·
      </span>
      <span className="inline-flex items-center gap-1 text-muted text-sm tabular-nums transition-colors group-hover:text-foreground">
        <Star className="size-3.5 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{formattedCount}</span>
        <span className="sr-only">{`${formattedCount} ${starCount === 1 ? "star" : "stars"}`}</span>
      </span>
    </>
  );
}
