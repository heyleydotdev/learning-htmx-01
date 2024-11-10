import type { HonoEnv } from "~/index"

import { Hono } from "hono"

import CreateForm from "~/components/segments/expense-form"
import { RecentExpensesInner } from "~/components/segments/expenses-recent"
import ExpensesStats from "~/components/segments/expenses-stats"
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

    return c.html(<CreateForm />, 201, {
      "HX-Trigger": '{"newExpense":"true","showSnackbar":"Your expense is added to the list!"}',
    })
  })
  .get("/expenses/stats", (c) => {
    return c.html(<ExpensesStats context={c} />)
  })
  .get("/expenses/recent", (c) => {
    return c.html(<RecentExpensesInner context={c} />)
  })
