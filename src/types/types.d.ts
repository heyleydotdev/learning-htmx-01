export type FixKeyIssue<T> = T & { key?: string }

export type ExpenseTableRow = {
  id: string
  expense: string
  amount: string
  date: string
  createdAt: Date
}
