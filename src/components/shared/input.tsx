import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export default function Input({ class: className, ...rest }: JSX.IntrinsicElements["input"]) {
  return (
    <input
      class={cn(
        "ring-border focus-visible:ring-ring hover:ring-border-150 relative inline-flex w-full items-center px-3 py-1.5 text-sm/6 shadow-sm ring-1 ring-inset placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...rest}
    />
  )
}
