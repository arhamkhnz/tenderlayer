import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@tenderlayer/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tenderlayer/ui/components/card";

export function PageNotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-6 py-[max(1.5rem,env(titlebar-area-height,46px))]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle role="heading" aria-level={1}>
            Page not found
          </CardTitle>
          <CardDescription>This page doesn’t exist in TenderLayer.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <Link to="/dashboard" replace className={buttonVariants({ variant: "outline" })}>
            Go to dashboard
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
