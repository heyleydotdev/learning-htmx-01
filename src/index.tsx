import type { GetDatabase } from "~/db"

import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"

import { _layoutApp } from "~/components/layouts/layout-app"
import { _layoutRoot } from "~/components/layouts/layout-root"
import ErrorPage from "~/components/page-error"
import Alert from "~/components/shared/alert"
import { isAPIRoute } from "~/lib/utils"
import { _devTiming, _setVariables, useAPIMiddleware, usePagesMiddleware } from "~/middlewares"
import { apiRoutes } from "~/routes/api"
import { indexRoutes } from "~/routes/pages"

export type HonoBindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

export type HonoVariables = {
  db: GetDatabase
}

export type HonoEnv = {
  Bindings: HonoBindings
  Variables: HonoVariables
}

const app = new Hono<HonoEnv>({
  // isn't working in cloudflare pages :|
  // getPath: (req) => {
  //   const url = new URL(req.url)
  //   if (/^\/(?!api(\/|$)|.*\.\w{2,4}$).*$/.test(url.pathname)) {
  //     url.pathname = `/pages${url.pathname.replace(/\/$/, "")}`
  //   }
  //   return url.pathname
  // },
})

app.onError((_, c) => {
  c.status(500)
  if (!isAPIRoute(c.req.path)) {
    c.setRenderer((content) => c.html(content))
    return c.render(<ErrorPage />)
  } else {
    c.header("HX-Trigger", "serverError")
  }
  return c.body("Internal Server Error")
})

app.notFound((c) => {
  c.status(404)
  if (!isAPIRoute(c.req.path)) {
    return c.render(<Alert>The page you requested isn&apos;t available. Please check the URL or return to the homepage.</Alert>)
  }
  return c.body("404 Not Found")
})

// Global middlewares
app.use(cors())
app.use(secureHeaders())
app.use(logger())
app.use(_setVariables)

// Pages middlewares
app.use(usePagesMiddleware(_layoutRoot))
app.use(usePagesMiddleware(_layoutApp))

// Pages routes
app.route("/", indexRoutes)

// API middlewares
app.use("/api/*", useAPIMiddleware(_devTiming))

// API Routes
app.route("/api", apiRoutes)

export default app
