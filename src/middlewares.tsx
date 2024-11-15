import type { HonoEnv } from "~/index"
import type { MiddlewareHandler } from "hono"
import type { z } from "zod"

import { createMiddleware } from "hono/factory"
import { validator } from "hono/validator"

import { getDatabase } from "~/db"
import { flattenZodFieldErrors, isAPIRoute } from "~/lib/utils"

type HonoValidatorArgs = Parameters<typeof validator>
export const zFormValidator = <T extends z.Schema, R extends HonoValidatorArgs[0]>(target: R, schema: T) => {
  return validator(target, (value) => {
    const parse = schema.safeParse(value)
    if (!parse.success) {
      return { value, valid: undefined, errors: flattenZodFieldErrors(parse.error) }
    }
    return { value: {}, valid: parse.data as z.output<T>, errors: undefined }
  })
}

export const _setVariables = createMiddleware<HonoEnv>((c, next) => {
  const db = getDatabase(c.env.D1_DATABASE)
  c.set("db", db)
  return next()
})

// https://github.com/t3-oss/create-t3-turbo/blob/8ca45cd2b06096c14d36a713dce32d7afcb1fed7/packages/api/src/trpc.ts#L99
export const _devTiming = createMiddleware<HonoEnv>(async (c, next) => {
  if (import.meta.env.DEV) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 600) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }
  await next()
})

export const usePagesMiddleware = (m: MiddlewareHandler) => {
  return createMiddleware(async (c, next) => {
    if (!isAPIRoute(c.req.path)) {
      return m(c, next)
    }
    return next()
  })
}

export const useAPIMiddleware = (m: MiddlewareHandler) => {
  return createMiddleware(async (c, next) => {
    if (isAPIRoute(c.req.path)) {
      return m(c, next)
    }
    return next()
  })
}
