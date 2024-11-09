import type { HonoEnv } from "~/index"

import { Hono } from "hono"

import AppLayout from "~/components/app-layout"
import CreateForm from "~/components/create-form"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/shared/card"
import { _expenseSchema } from "~/lib/validations"
import { zFormValidator } from "~/middlewares"

export const indexRoutes = new Hono<HonoEnv>()
  .get("/", (c) => {
    return c.render(
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Create Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateForm />
          </CardContent>
        </Card>
      </AppLayout>
    )
  })
  .post("/", zFormValidator("form", _expenseSchema), async (c) => {
    const { value, errors } = c.req.valid("form")

    if (errors) {
      return c.html(<CreateForm prevState={value} errors={errors} />)
    }

    return c.html(<CreateForm />)
  })
