import type { HonoEnv } from "~/index"
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"

import { useRequestContext } from "hono/jsx-renderer"

import { ExpenseTableData, ExpenseTableRoot } from "~/components/segments/expense-table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"
import Spinner from "~/components/shared/spinner"
import { formatCurrency } from "~/lib/utils"

export async function RecentExpenses() {
  return (
    <RecentExpensesOuter>
      <RecentExpensesInner />
    </RecentExpensesOuter>
  )
}

interface RecentExpensesProps {
  context?: Context<HonoEnv>
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

  return <ExpenseTableData data={expenses} />
}

function RecentExpensesOuter({ children }: PropsWithChildren) {
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
        <ExpenseTableRoot class="[--side-padding:var(--spacing)]">{children}</ExpenseTableRoot>
      </CardContent>
    </Card>
  )
}
