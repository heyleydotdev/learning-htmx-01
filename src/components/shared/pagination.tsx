import type { FixKeyIssue } from "~/types/types"
import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export const Pagination = ({ class: className, ...rest }: JSX.IntrinsicElements["nav"]) => (
  <nav role="navigation" aria-label="pagination" class={cn("flex w-full justify-center", className)} {...rest} />
)

export const PaginationContent = ({ class: className, ...rest }: JSX.IntrinsicElements["ul"]) => (
  <ul class={cn("flex flex-row flex-wrap items-center gap-1", className)} {...rest} />
)

export const PaginationItem = (props: JSX.IntrinsicElements["li"]) => <li {...props} />

type PaginationLinkProps = {
  active?: boolean
} & JSX.IntrinsicElements["a"]

export const PaginationLink = ({ class: className, active, ...rest }: PaginationLinkProps) => (
  <a
    aria-current={active ? "page" : undefined}
    className={cn(
      "flex size-9 items-center justify-center border p-1.5 text-center text-sm/6 font-medium shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
      active && "pointer-events-none cursor-default bg-gray-100 shadow-none hover:bg-gray-100",
      className
    )}
    {...rest}
  />
)

export const PaginationPrevious = ({ class: className, ...rest }: FixKeyIssue<PaginationLinkProps>) => (
  <PaginationLink aria-label="Go to previous page" class={cn("w-auto px-3", className)} {...rest}>
    <span>Previous</span>
  </PaginationLink>
)

export const PaginationNext = ({ class: className, ...rest }: FixKeyIssue<PaginationLinkProps>) => (
  <PaginationLink aria-label="Go to next page" class={cn("w-auto px-3", className)} {...rest}>
    <span>Next</span>
  </PaginationLink>
)
