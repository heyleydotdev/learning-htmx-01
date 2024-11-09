import assert from "assert"

import { defineConfig } from "drizzle-kit"

assert(process.env.CLOUDFLARE_ACCOUNT_ID, "env: CLOUDFLARE_ACCOUNT_ID missing!")
assert(process.env.CLOUDFLARE_DATABASE_ID, "env: CLOUDFLARE_DATABASE_ID missing!")
assert(process.env.CLOUDFLARE_D1_TOKEN, "env: CLOUDFLARE_D1_TOKEN missing!")

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    token: process.env.CLOUDFLARE_D1_TOKEN,
  },
})
