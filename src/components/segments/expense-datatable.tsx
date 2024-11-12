import type { HonoEnv } from "~/index"
import type { Context } from "hono"
import type { PropsWithChildren } from "hono/jsx"

import { useRequestContext } from "hono/jsx-renderer"
import { count } from "drizzle-orm"

import { ExpenseTableData, ExpenseTableRoot } from "~/components/segments/expense-table"
import { Card } from "~/components/shared/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/shared/pagination"
import { expensesTable } from "~/db/schema"
import { createPagination } from "~/lib/pagination"
import { formatCurrency } from "~/lib/utils"
import { _expenseTableQuerySchema } from "~/lib/validations"

export default function ExpenseDataTable() {
  return (
    <div class="grid grid-cols-1 gap-y-6">
      <ExpenseDataTableOuter>
        <ExpenseDataTableInner />
      </ExpenseDataTableOuter>
      <ExpenseDataTablePagination />
    </div>
  )
}

function ExpenseDataTableOuter({ children }: PropsWithChildren) {
  return (
    <Card class="p-0">
      <ExpenseTableRoot>{children}</ExpenseTableRoot>
    </Card>
  )
}

interface ExpenseDataTableInnerProps {
  context?: Context<HonoEnv>
}

export async function ExpenseDataTableInner({ context }: ExpenseDataTableInnerProps) {
  const c = context ?? useRequestContext<HonoEnv>()
  const { page: currentPage } = getTableQueries(c)

  const getExpenses = await c.var.db.query.expensesTable.findMany({
    orderBy: (fields, ops) => ops.desc(fields.createdAt),
    offset: (currentPage - 1) * 20,
    limit: 20,
  })

  const expenses = getExpenses.map((e) => ({
    ...e,
    amount: formatCurrency(e.amount),
    date: e.date.toLocaleDateString("en-US", { dateStyle: "medium" }),
  }))

  return <ExpenseTableData data={expenses} />
}

export async function ExpenseDataTablePagination({ context }: ExpenseDataTableInnerProps) {
  const c = context ?? useRequestContext<HonoEnv>()
  const { page: currentPage } = getTableQueries(c)

  const totalItems = await c.var.db
    .select({ count: count() })
    .from(expensesTable)
    .then((count) => count[0]?.count ?? 0)

  const pagination = createPagination({ currentPage, totalItems, pageSize: 20, surroundBy: 2 })

  return (
    <Pagination class="justify-end">
      <PaginationContent>
        <PaginationPrevious
          href={pagination.hasPrevious ? `?page=${pagination.currentPage - 1}` : "#"}
          active={pagination.isFirstPage}
          hx-swap="show:none"
        />
        {pagination.visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={`?page=${page}`} active={pagination.currentPage === page} hx-swap="show:none">
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext
          href={pagination.hasNext ? `?page=${pagination.currentPage + 1}` : "#"}
          active={pagination.isLastPage}
          hx-swap="show:none"
        />
      </PaginationContent>
    </Pagination>
  )
}

function getTableQueries(c: Context<HonoEnv>) {
  return _expenseTableQuerySchema.parse({
    page: c.req.query("page"),
  })
}
