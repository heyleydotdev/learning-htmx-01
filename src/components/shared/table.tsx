import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export type TableProps = JSX.IntrinsicElements["table"]

export const Table = ({ class: className, ...rest }: TableProps) => {
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn("w-full whitespace-nowrap text-sm/6 [--side-padding:theme(spacing[3])]", className)} {...rest} />
    </div>
  )
}

export const TableHeader = ({ class: className, ...rest }: JSX.IntrinsicElements["thead"]) => {
  return <thead class={cn("[&_tr]:border-b", className)} {...rest} />
}

export const TableBody = ({ class: className, ...rest }: JSX.IntrinsicElements["tbody"]) => {
  return <tbody class={cn("divide-y", className)} {...rest} />
}

export const TableRow = ({ class: className, ...rest }: JSX.IntrinsicElements["tr"]) => {
  return <tr class={cn("transition-colors hover:bg-gray-50", className)} {...rest} />
}

export const TableHead = ({ class: className, ...rest }: JSX.IntrinsicElements["th"]) => {
  return <th class={cn("px-[--side-padding] py-2.5 text-left align-middle font-medium", className)} {...rest} />
}

export const TableCell = ({ class: className, ...rest }: JSX.IntrinsicElements["td"]) => {
  return <td class={cn("px-[--side-padding] py-2.5 align-middle", className)} {...rest} />
}
