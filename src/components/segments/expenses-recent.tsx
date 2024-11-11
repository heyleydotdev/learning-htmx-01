import type { HonoEnv } from "~/index"
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"

import { Fragment } from "hono/jsx"
import { useRequestContext } from "hono/jsx-renderer"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"
import Spinner from "~/components/shared/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/shared/table"
import { formatCurrency } from "~/lib/utils"

interface RecentExpensesProps {
  context?: Context<HonoEnv>
}

export async function RecentExpenses() {
  return (
    <RecentExpensesWrapper>
      <RecentExpensesInner />
    </RecentExpensesWrapper>
  )
}

export async function RecentExpensesInner({ context }: RecentExpensesProps) {
  const c = context ?? useRequestContext<HonoEnv>()

  const getExpenses = await c.var.db.query.expensesTable.findMany({
    orderBy: (fields, ops) => ops.desc(fields.createdAt),
    limit: 10,
  })
  const expenses = getExpenses.map((e) => ({
    ...e,
    amount: formatCurrency(e.amount),
    date: e.date.toLocaleDateString("en-US", { dateStyle: "medium" }),
  }))

  if (!expenses.length) {
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
      {expenses.map((item) => (
        <TableRow key={item.id}>
          <TableCell class="text-gray-950">
            <p class="line-clamp-2 min-w-24 max-w-56 whitespace-normal break-words">{item.expense}</p>
          </TableCell>
          <TableCell class="font-medium text-red-600">-{item.amount}</TableCell>
          <TableCell class="text-end text-[0.8rem]/6">{item.date}</TableCell>
        </TableRow>
      ))}
    </Fragment>
  )
}

function RecentExpensesWrapper({ children }: PropsWithChildren) {
  return (
    <Card
      hx-ext="loading-states"
      hx-get="/api/expenses/recent"
      hx-swap="innerHTML"
      hx-target="#expenses-table"
      hx-trigger="newExpense from:body"
      class="pb-0"
    >
      <CardHeader>
        <CardTitle class="flex items-center justify-between gap-2">
          <span>Recently Added Expenses</span>
          <Spinner class="htmx-indicator size-5" />
        </CardTitle>
      </CardHeader>
      <CardContent class="-mx-[--spacing] grid w-auto grid-cols-1">
        <Table class="[--side-padding:var(--spacing)]">
          <TableHeader>
            <TableHead>Expense</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead class="text-end">Date</TableHead>
          </TableHeader>
          <TableBody id="expenses-table">{children}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
