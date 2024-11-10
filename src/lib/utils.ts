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
