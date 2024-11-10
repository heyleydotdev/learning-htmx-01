import type { HonoEnv } from "~/index"

import { Hono } from "hono"

import CreateForm from "~/components/segments/expense-form"
import { RecentExpensesInner } from "~/components/segments/expenses-recent"
import Alert from "~/components/shared/alert"
import { expensesTable } from "~/db/schema"
import { _expenseSchema } from "~/lib/validations"
import { zFormValidator } from "~/middlewares"

export const apiRoutes = new Hono<HonoEnv>()
  .put("/expenses", zFormValidator("form", _expenseSchema), async (c) => {
    const { value, valid, errors } = c.req.valid("form")

    if (errors) {
      return c.html(<CreateForm prevState={value} errors={errors} />, 400)
    }

    await c.var.db.insert(expensesTable).values(valid)

    return c.html(
      <CreateForm>
        <Alert variant={"success"}>Your expense is added to the list!</Alert>
      </CreateForm>,
      201,
      { "HX-Trigger": "newExpense" }
    )
  })
  .get("/expenses/recent", (c) => {
    return c.html(<RecentExpensesInner context={c} />)
  })
