import { z } from "zod"

export const _expenseSchema = z.object({
  expense: z.string().min(3).max(255),
  amount: z.coerce.number(),
  date: z.coerce.date(),
})
