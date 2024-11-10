import { z } from "zod"

export const _expenseSchema = z.object({
  expense: z.string().min(3, "Must contain at least 3 character(s)").max(255, "Must contain at most 255 character(s)"),
  amount: z.coerce.number().refine((n) => n > 0, "Must be a positive number"),
  date: z.coerce.date().refine((d) => {
    const date = new Date(d)
    date.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date <= today
  }, "Please select a date that is today or earlier"),
})
