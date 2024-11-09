import type { HonoEnv } from "~/index"
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"

import { Fragment } from "hono/jsx"
import { useRequestContext } from "hono/jsx-renderer"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"
import Spinner from "~/components/shared/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/shared/table"

interface ExpensesListProps {
  context?: Context<HonoEnv>
}

export async function ExpensesList() {
  return (
    <ExpensesListWrapper>
      <ExpensesListInner />
    </ExpensesListWrapper>
  )
}

export async function ExpensesListInner({ context }: ExpensesListProps) {
  const c = context ?? useRequestContext<HonoEnv>()
  const getExpenses = await c.var.db.query.expensesTable.findMany({
    orderBy: (fields, ops) => ops.desc(fields.createdAt),
    limit: 10,
  })

  const expenses = getExpenses.map((e) => ({
    ...e,
    amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(e.amount),
    date: e.date.toLocaleDateString("en-US", { dateStyle: "medium" }),
  }))

  if (!expenses.length) {
    return <div class="px-6 py-16 text-center text-sm/6 text-gray-500">No expenses found. Add your first expense!</div>
  }

  return (
    <Fragment>
      {expenses.map((item) => (
        <TableRow key={item.id}>
          <TableCell class="text-gray-950">
            <p class="line-clamp-2 max-w-xs whitespace-pre-wrap break-words">{item.expense}</p>
          </TableCell>
          <TableCell class="font-medium text-red-600">-{item.amount}</TableCell>
          <TableCell class="text-end text-[0.8rem]/6">{item.date}</TableCell>
        </TableRow>
      ))}
    </Fragment>
  )
}

function ExpensesListWrapper({ children }: PropsWithChildren) {
  return (
    <Card
      hx-ext="loading-states"
      hx-get="/expenses"
      hx-swap="innerHTML"
      hx-target="#expenses-table"
      hx-trigger="newExpense from:body"
      class="pb-0"
    >
      <CardHeader>
        <CardTitle class="flex items-center justify-between gap-2">
          <span>Latest Expenses</span>
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
