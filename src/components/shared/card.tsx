import type { JSX } from "hono/jsx"

import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

const Card = ({ class: className, ...rest }: JSX.IntrinsicElements["div"]) => {
  return (
    <div class={cn("space-y-[--spacing] border p-[--spacing] shadow-sm [--spacing:theme(spacing[6])]", className)} {...rest} />
  )
}

const CardHeader = ({ class: className, ...rest }: JSX.IntrinsicElements["div"]) => {
  return <div class={cn("space-y-1", className)} {...rest} />
}

export const cardTitleClass = cva("text-pretty text-base font-semibold text-gray-950")
const CardTitle = ({ class: className, ...rest }: JSX.IntrinsicElements["h4"]) => {
  return <h4 class={cn(cardTitleClass(), className)} {...rest} />
}

const CardContent = ({ class: className, ...rest }: JSX.IntrinsicElements["div"]) => {
  return <div class={cn("w-full", className)} {...rest} />
}

export { Card, CardHeader, CardTitle, CardContent }
