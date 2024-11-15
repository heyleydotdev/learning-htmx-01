import type { HonoEnv } from "~/index"

import { Hono } from "hono"

import { _dataTableMiddleware, ExpenseDataTable } from "~/components/segments/expense-datatable"
import CreateForm from "~/components/segments/expense-form"
import { RecentExpenses } from "~/components/segments/expenses-recent"
import ExpensesStats from "~/components/segments/expenses-stats"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"

export const indexRoutes = new Hono<HonoEnv>()
  .get("/", (c) => {
    return c.render(
      <div class="grid gap-y-8">
        <ExpensesStats />
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateForm />
          </CardContent>
        </Card>
        <RecentExpenses />
      </div>,
      { title: "Home" }
    )
  })
  .get("/expenses", _dataTableMiddleware, (c) => {
    return c.render(<ExpenseDataTable />, { title: "Expenses" })
  })
