import type { ZodError } from "zod"

import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs))

export const flattenZodFieldErrors = (error: ZodError) =>
  Object.entries(error.flatten().fieldErrors).reduce<Record<string, string>>((acc, [key, errors]) => {
    if (errors?.[0]) {
      acc[key] = errors[0]
    }
    return acc
  }, {})

export const isAPIRoute = (path: string) => {
  return path === "/api" || path.startsWith("/api/")
}

export const formatCurrency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export const getDayStart = (date: Date) => {
  date.setUTCHours(0, 0, 0, 0)
  return date
}

export const getWeekRange = (): [Date, Date] => {
  const today = new Date()
  const day = today.getDay()
  const startOfWeek = new Date(today)
  const endOfWeek = new Date(today)

  startOfWeek.setDate(today.getDate() - day)
  startOfWeek.setUTCHours(0, 0, 0, 0)

  endOfWeek.setDate(today.getDate() + (6 - day))

  return [startOfWeek, endOfWeek]
}
