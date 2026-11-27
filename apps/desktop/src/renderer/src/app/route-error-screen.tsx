import { useId } from "react";

import { Button, buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";

import { supportEmail } from "@shared/support";

interface RouteErrorScreenProps {
  title: string;
  onRetry: () => void;
}

export function RouteErrorScreen({ title, onRetry }: RouteErrorScreenProps) {
  const titleId = useId();

  return (
    <div data-content-padding="false" className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center p-6">
      <Card role="region" aria-labelledby={titleId} className="w-full max-w-md">
        <CardHeader>
          <CardTitle id={titleId} role="heading" aria-level={1}>
            {title}
          </CardTitle>
          <CardDescription>If retrying doesn’t help, restart TenderLayer.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button type="button" onClick={onRetry}>
            Retry
          </Button>
          <a
            href="https://github.com/arhamkhnz/tenderlayer/issues"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            Report an issue
          </a>
          <div className="flex flex-col gap-1 text-sm">
            <p>
              Or email{" "}
              <a
                href={`mailto:${supportEmail}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                {supportEmail}
              </a>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Include a screenshot, your app version, and your OS version.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
