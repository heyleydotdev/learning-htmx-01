import type { JSX } from "hono/jsx"

import { cn } from "~/lib/utils"

export const Table = ({ class: className, ...rest }: JSX.IntrinsicElements["table"]) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full whitespace-nowrap text-sm/6 [--side-padding:theme(spacing[3])]", className)} {...rest} />
    </div>
  )
}

export const TableHeader = ({ class: className, ...rest }: JSX.IntrinsicElements["thead"]) => {
  return <thead className={cn("[&_tr]:border-b", className)} {...rest} />
}

export const TableBody = ({ class: className, ...rest }: JSX.IntrinsicElements["tbody"]) => {
  return <tbody className={cn("divide-y", className)} {...rest} />
}

export const TableRow = ({ class: className, ...rest }: JSX.IntrinsicElements["tr"]) => {
  return <tr className={cn("transition-colors hover:bg-gray-50", className)} {...rest} />
}

export const TableHead = ({ class: className, ...rest }: JSX.IntrinsicElements["th"]) => {
  return <th className={cn("px-[--side-padding] py-3 text-left align-middle font-medium", className)} {...rest} />
}

export const TableCell = ({ class: className, ...rest }: JSX.IntrinsicElements["td"]) => {
  return <td className={cn("px-[--side-padding] py-2.5 align-middle", className)} {...rest} />
}
