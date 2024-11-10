import type { HonoEnv } from "~/index"

import { Hono } from "hono"

import CreateForm from "~/components/segments/expense-form"
import { RecentExpenses } from "~/components/segments/expenses-recent"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"

export const indexRoutes = new Hono<HonoEnv>().get("/", (c) => {
  return c.render(
    <div class="grid gap-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateForm />
        </CardContent>
      </Card>
      <RecentExpenses />
    </div>
  )
})
