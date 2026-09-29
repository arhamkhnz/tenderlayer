import type { ReactNode } from "react";
import { ViewTransition } from "react";

export default function SiteTemplate({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
