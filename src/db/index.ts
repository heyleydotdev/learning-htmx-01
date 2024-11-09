import { drizzle } from "drizzle-orm/d1"

import * as schema from "./schema"

export type GetDatabase = ReturnType<typeof getDatabase>

export const getDatabase = (d1: CloudflareBindings["D1_DATABASE"]) => {
  return drizzle(d1, { schema })
}
