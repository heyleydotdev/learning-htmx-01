import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export type LabelProps = JSX.IntrinsicElements["label"]

export default function Label({ class: className, ...rest }: JSX.IntrinsicElements["label"]) {
  return <label class={cn("select-none text-sm/6 font-medium text-gray-950", className)} {...rest} />
}
