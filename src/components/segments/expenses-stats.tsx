import type { HonoEnv } from "~/index"
import type { Context } from "hono"

import { useRequestContext } from "hono/jsx-renderer"
import { and, eq, gte, lte, sum } from "drizzle-orm"

import { Card } from "~/components/shared/card"
import { expensesTable } from "~/db/schema"
import { formatCurrency, getDayStart, getWeekRange } from "~/lib/utils"

interface ExpensesStatsProps {
  context?: Context<HonoEnv>
}

export default async function ExpensesStats({ context }: ExpensesStatsProps) {
  const c = context ?? useRequestContext<HonoEnv>()
  const todayStart = getDayStart(new Date())
  const [weekFirst, weekLast] = getWeekRange()

  const [[today], [week]] = await c.var.db.batch([
    c.var.db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.date, todayStart)),
    c.var.db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(and(gte(expensesTable.date, weekFirst), lte(expensesTable.date, weekLast))),
  ])

  const formattedToday = formatCurrency(Number(today?.total ?? "0"))
  const formattedWeek = formatCurrency(Number(week?.total ?? "0"))

  return (
    <Card
      hx-get="/api/expenses/stats"
      hx-swap="outerHTML"
      hx-target="this"
      hx-trigger="newExpense from:body"
      class="grid grid-cols-1 divide-y border [--spacing:0] sm:grid-cols-2 sm:divide-x sm:divide-y-0"
    >
      <StatCard title="Spending Today" amount={formattedToday} />
      <StatCard title="Spending This Week" amount={formattedWeek} />
    </Card>
  )
}

interface StatCardProps {
  title: string
  amount: string
}

function StatCard({ title, amount }: StatCardProps) {
  return (
    <div class="grid h-11 grid-cols-[auto_1fr_auto] place-items-center gap-x-4 px-4 text-[0.825rem]/6">
      <h4>{title}</h4>
      <div class="h-px w-full border-t" />
      <p class="font-medium text-gray-950">{amount}</p>
    </div>
  )
}
