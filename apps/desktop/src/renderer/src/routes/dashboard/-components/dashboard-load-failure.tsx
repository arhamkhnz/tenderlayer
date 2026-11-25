import { useRouter } from "@tanstack/react-router";

import { Button, buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";

import { supportEmail } from "@shared/support";

export function DashboardLoadFailure() {
  const router = useRouter();

  return (
    <main className="relative grid min-h-svh place-items-center bg-background px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 [app-region:drag] [-webkit-app-region:drag]"
        style={{ height: "env(titlebar-area-height, 46px)" }}
      />
      <Card role="region" aria-labelledby="dashboard-error-title" className="w-full max-w-md">
        <CardHeader>
          <CardTitle id="dashboard-error-title" role="heading" aria-level={1}>
            Couldn’t load the dashboard
          </CardTitle>
          <CardDescription>If retrying doesn’t help, restart TenderLayer.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button type="button" onClick={() => void router.invalidate()}>
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
    </main>
  );
}
