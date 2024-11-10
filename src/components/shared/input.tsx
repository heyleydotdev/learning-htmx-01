import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export default function Input({ class: className, ...rest }: JSX.IntrinsicElements["input"]) {
  return (
    <input
      class={cn(
        "relative inline-flex w-full items-center px-3 py-1.5 text-sm/6 shadow-sm ring-1 ring-inset ring-border placeholder:text-gray-500 hover:ring-border-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 [&[type=date]]:h-9",
        className
      )}
      {...rest}
    />
  )
}
