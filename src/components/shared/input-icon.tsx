import type { InputProps } from "~/components/shared/input"
import type { FixKeyIssue } from "~/types/types"
import type { Child } from "hono/jsx"

import Input from "~/components/shared/input"
import { cn } from "~/lib/utils"

interface InputIconProps extends FixKeyIssue<InputProps> {
  icon: Child
}

export default function InputIcon({ icon, class: className, ...rest }: InputIconProps) {
  return (
    <div class="relative isolate">
      <span class="absolute left-3.5 top-1/2 z-10 block -translate-y-1/2 sm:left-3">{icon}</span>
      <Input class={cn("z-0 pl-10 sm:pl-9", className)} {...rest} />
    </div>
  )
}
