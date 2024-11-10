import type { FixKeyIssue } from "~/types/types"
import type { JSX } from "hono/jsx"

import { Icons } from "~/components/icons"
import { cn } from "~/lib/utils"

export default function Spinner({
  "data-loading-class": dataLoadingClass,
  class: className,
  ...rest
}: FixKeyIssue<JSX.IntrinsicElements["svg"]>) {
  return <Icons.spinner class={cn("size-4", className)} data-loading-class={cn("animate-spin", dataLoadingClass)} {...rest} />
}
