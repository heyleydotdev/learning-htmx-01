import type { VariantProps } from "class-variance-authority"
import type { JSX } from "hono/jsx"

import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center text-center text-sm/6 shadow-sm transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
    "[--d-px:theme(spacing[3])] [--d-py:theme(spacing[1.5])]",
  ],
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white hover:bg-indigo-500",
        ghost: "bg-transparent text-gray-950 shadow-none hover:bg-gray-100",
      },
      size: {
        default: "px-[--d-px] py-[--d-py]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonProps = JSX.IntrinsicElements["button"] & VariantProps<typeof buttonVariants>

export default function Button({ class: className, variant, size, ...rest }: ButtonProps) {
  return <button class={cn(buttonVariants({ variant, size }), className)} {...rest} />
}
