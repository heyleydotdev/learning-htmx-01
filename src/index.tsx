import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"

import { renderer } from "~/middlewares/renderer"

let counter = 0

const app = new Hono()

app.use(cors())
app.use(secureHeaders())
app.use(logger())

app.use(renderer)

app.get("/", (c) => {
  return c.render(
    <div class="space-y-4">
      <h1 class="text-lg font-medium text-gray-950">Hono + HTMX</h1>
      <div class="space-y-2">
        <div id="counter">{counter}</div>
        <button class="border px-3 py-1 text-sm" hx-post="/api/count" hx-target="#counter">
          Count
        </button>
      </div>
    </div>
  )
})

app.post("/api/count", (c) => {
  counter++
  return c.text(counter.toString())
})

export default app
