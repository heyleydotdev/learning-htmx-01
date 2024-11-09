import type { HonoEnv } from "~/index"

import { Hono } from "hono"

import AppLayout from "~/components/app-layout"
import CreateForm from "~/components/create-form"
import { ExpensesList, ExpensesListInner } from "~/components/expenses-list"
import Alert from "~/components/shared/alert"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"
import { expensesTable } from "~/db/schema"
import { _expenseSchema } from "~/lib/validations"
import { zFormValidator } from "~/middlewares"

export const indexRoutes = new Hono<HonoEnv>()
  .get("/", (c) => {
    return c.render(
      <AppLayout>
        <div class="grid gap-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateForm />
            </CardContent>
          </Card>
          <ExpensesList />
        </div>
      </AppLayout>
    )
  })
  .post("/", zFormValidator("form", _expenseSchema), async (c) => {
    const { value, valid, errors } = c.req.valid("form")

    if (errors) {
      return c.html(<CreateForm prevState={value} errors={errors} />, 400)
    }

    await c.var.db.insert(expensesTable).values(valid)

    return c.html(<CreateForm alert={<Alert variant={"success"}>Your expense is added to the list!</Alert>} />, 201, {
      "HX-Trigger": "newExpense",
    })
  })
  .get("/expenses", (c) => {
    return c.html(<ExpensesListInner context={c} />)
  })
