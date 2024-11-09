import type { VariantProps } from "class-variance-authority"
import type { JSX } from "hono/jsx"

import { useId } from "hono/jsx"
import { cva } from "class-variance-authority"

import { Icons } from "~/components/icons"
import { cn } from "~/lib/utils"

type AlertProps = JSX.IntrinsicElements["div"] & VariantProps<typeof alertVariants>

const alertVariants = cva("flex gap-x-3 border", {
  variants: {
    variant: {
      success: "border-teal-200 bg-teal-100 text-teal-800",
      danger: "border-red-200 bg-red-100 text-red-800",
    },
    size: {
      default: "p-4 text-sm",
    },
  },
  defaultVariants: {
    variant: "danger",
    size: "default",
  },
})

const ALERT_ICONS = {
  success: "badgeCheck",
  danger: "circleX",
} satisfies Record<NonNullable<VariantProps<typeof alertVariants>["variant"]>, keyof typeof Icons>

export default function Alert({ class: className, children, variant, size, ...rest }: AlertProps) {
  const id = useId()
  const Icon = Icons[ALERT_ICONS[variant ?? "danger"]]

  return (
    <div class={cn(alertVariants({ variant, size }), className)} role="alert" aria-labelledby={id} {...rest}>
      <Icon class="mt-0.5 size-4 flex-shrink-0" />
      <span id={id} class="flex-1 text-pretty">
        {children}
      </span>
    </div>
  )
}
