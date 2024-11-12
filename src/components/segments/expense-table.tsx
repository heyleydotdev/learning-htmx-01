import type { TableProps } from "~/components/shared/table"
import type { ExpenseTableRow, FixKeyIssue } from "~/types/types"

import { Fragment } from "hono/jsx/jsx-runtime"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/shared/table"

export function ExpenseTableRoot({ children, ...rest }: FixKeyIssue<TableProps>) {
  return (
    <Table {...rest}>
      <TableHeader>
        <TableRow>
          <TableHead class="w-full">Expense</TableHead>
          <TableHead class="text-right">Amount</TableHead>
          <TableHead class="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody id="expenses-table">{children}</TableBody>
    </Table>
  )
}

interface ExpenseTableDataProps {
  data: ExpenseTableRow[]
}

export function ExpenseTableData({ data }: ExpenseTableDataProps) {
  if (!data.length) {
    return (
      <TableRow>
        <TableCell colspan={3} class="h-24 text-center text-gray-500">
          No expenses found.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Fragment>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell class="text-gray-950">
            <p class="line-clamp-2 min-w-24 max-w-56 whitespace-normal break-words">{item.expense}</p>
          </TableCell>
          <TableCell class="text-right font-medium text-red-600">-{item.amount}</TableCell>
          <TableCell class="text-right text-[0.8rem]/6">{item.date}</TableCell>
        </TableRow>
      ))}
    </Fragment>
  )
}
