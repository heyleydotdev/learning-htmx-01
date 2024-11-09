import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"

import { _devTimingMiddleware, _errorHandlerMiddleware } from "~/middlewares"
import { renderer } from "~/middlewares/renderer"
import { indexRoutes } from "~/routes"

export type HonoBindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

export type HonoVariables = {
  // Database gose here
  db: unknown
}

export type HonoEnv = {
  Bindings: HonoBindings
  Variables: HonoVariables
}

const app = new Hono<HonoEnv>()

app.use(cors())
app.use(secureHeaders())
app.use(logger())

app.use(renderer)
app.use(_devTimingMiddleware)
app.use(_errorHandlerMiddleware)

app.route("/", indexRoutes)

export default app
