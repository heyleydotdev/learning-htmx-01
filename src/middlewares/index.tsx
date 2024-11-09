import type { HonoEnv } from "~/index"
import type { z } from "zod"

import { createMiddleware } from "hono/factory"
import { validator } from "hono/validator"

import Alert from "~/components/shared/alert"
import { getDatabase } from "~/db"
import { flattenZodFieldErrors } from "~/lib/utils"

type HonoValidatorArgs = Parameters<typeof validator>
export const zFormValidator = <T extends z.Schema, R extends HonoValidatorArgs[0]>(target: R, schema: T) => {
  return validator(target, (value) => {
    const parse = schema.safeParse(value)

    if (!parse.success) {
      return {
        value,
        valid: undefined,
        errors: flattenZodFieldErrors(parse.error),
      }
    }

    return {
      value: {},
      valid: parse.data as z.output<T>,
      errors: undefined,
    }
  })
}

export const _setVariableMiddleware = createMiddleware<HonoEnv>((c, next) => {
  const db = getDatabase(c.env.D1_DATABASE)
  c.set("db", db)
  return next()
})

// https://github.com/t3-oss/create-t3-turbo/blob/8ca45cd2b06096c14d36a713dce32d7afcb1fed7/packages/api/src/trpc.ts#L99
export const _devTimingMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  if (c.req.method === "GET") {
    return next()
  }

  const start = Date.now()

  if (c.env.ENVIRONMENT === "development") {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 600) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }
  await next()

  const end = Date.now()
  console.log(`[RPC] ${c.req.path} took ${end - start}ms to execute`)
})

export const _errorHandlerMiddleware = createMiddleware(async (c, next) => {
  await next()
  if (c.error) {
    c.res = await c.html(<Alert>Something went wrong. Please try again in a moment.</Alert>, 500)
  }
})
