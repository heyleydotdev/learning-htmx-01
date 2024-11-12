import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export type InputProps = JSX.IntrinsicElements["input"]

export default function Input({ class: className, ...rest }: InputProps) {
  return (
    <input
      class={cn(
        "relative inline-flex w-full items-center rounded-none px-3.5 py-2 shadow-sm ring-1 ring-inset ring-border placeholder:text-gray-500 hover:ring-border-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 sm:px-3 sm:py-1.5 sm:text-sm/6 [&[type=date]]:h-11 sm:[&[type=date]]:h-9",
        className
      )}
      {...rest}
    />
  )
}
