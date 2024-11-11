import moment from "moment"
import { z } from "zod"

export const _expenseSchema = z.object({
  expense: z.string().min(3, "Must contain at least 3 character(s)").max(255, "Must contain at most 255 character(s)"),
  amount: z.coerce.number().refine((n) => n > 0, "Must be a positive number"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform((s) => moment(s).utc(true).toDate())
    .refine((d) => {
      return moment(d).isSameOrBefore(moment.now(), "day")
    }, "Please select a date that is today or earlier"),
})
