import type { ComponentProps } from "react";

import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react";
import { cn } from "cn";

import { Button } from "@tenderlayer/ui/components/button";

function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-0.5", className)} {...props} />;
}

function PaginationItem(props: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = Omit<ComponentProps<typeof Button>, "nativeButton" | "render"> & {
  href?: string;
  isActive?: boolean;
};

function PaginationLink({ href, isActive, size = "icon", variant, ...props }: PaginationLinkProps) {
  return (
    <Button
      data-slot="pagination-link"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      variant={variant ?? (isActive ? "outline" : "ghost")}
      size={size}
      nativeButton={href === undefined}
      render={href === undefined ? undefined : <a href={href} />}
      {...props}
    />
  );
}

function PaginationPrevious({
  text = "Previous",
  children = <CaretLeftIcon data-icon="inline-start" />,
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" {...props}>
      {children}
      {text && <span className="hidden sm:block">{text}</span>}
    </PaginationLink>
  );
}

function PaginationNext({
  text = "Next",
  children = <CaretRightIcon data-icon="inline-end" />,
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" {...props}>
      {text && <span className="hidden sm:block">{text}</span>}
      {children}
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center [&_svg]:size-4", className)}
      {...props}
    >
      <DotsThreeIcon />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
