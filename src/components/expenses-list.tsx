import type { HonoEnv } from "~/index"
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"

import { useRequestContext } from "hono/jsx-renderer"

import { cardTitleClass } from "~/components/shared/card"

interface ExpensesListProps {
  context?: Context<HonoEnv>
}

export async function ExpensesList({ context }: ExpensesListProps) {
  const c = context ?? useRequestContext<HonoEnv>()
  const getExpenses = await c.var.db.query.expensesTable.findMany({
    orderBy: (fields, ops) => ops.desc(fields.createdAt),
    limit: 20,
  })

  const expenses = getExpenses.map((e) => ({
    ...e,
    amount: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(e.amount),
  }))

  if (!expenses.length) {
    return (
      <ExpensesListWrapper>
        <div class="px-6 py-16 text-center text-sm/6 text-gray-500">No expenses found. Add your first expense!</div>
      </ExpensesListWrapper>
    )
  }

  return (
    <ExpensesListWrapper>
      <ul class="divide-y">
        <li class="px-6 py-3">
          <h4 class={cardTitleClass()}>Latest Expenses</h4>
        </li>
        {expenses.map((item) => (
          <li key={item.id} class="grid grid-cols-2 px-6 py-2 text-sm">
            <p>{item.expense}</p>
            <p class="text-end">{item.amount}</p>
          </li>
        ))}
      </ul>
    </ExpensesListWrapper>
  )
}

function ExpensesListWrapper({ children }: PropsWithChildren) {
  return (
    <div id="expenses-list" class="border shadow-sm" hx-get="/expenses" hx-swap="outerHTML" hx-trigger="newExpense from:body">
      {children}
    </div>
  )
}
