import type { HonoEnv } from "~/index"
import type { CreatePagination } from "~/lib/pagination"
import type { PropsWithChildren } from "hono/jsx"

import { createMiddleware } from "hono/factory"
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

interface DataTableMiddlewareVariables extends HonoEnv {
  Variables: HonoEnv["Variables"] & {
    pagination: ReturnType<CreatePagination>
  }
}

export const _dataTableMiddleware = createMiddleware<DataTableMiddlewareVariables>(async (c, next) => {
  const { page: currentPage } = _expenseTableQuerySchema.parse({
    page: c.req.query("page"),
  })

  const totalItems = await c.var.db
    .select({ count: count() })
    .from(expensesTable)
    .then((count) => count[0]?.count ?? 0)

  const pagination = createPagination({ currentPage, totalItems, pageSize: 20, surroundBy: 2 })
  c.set("pagination", pagination)
  return next()
})

export function ExpenseDataTable() {
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

async function ExpenseDataTableInner() {
  const c = useRequestContext<DataTableMiddlewareVariables>()

  const getExpenses = await c.var.db.query.expensesTable.findMany({
    orderBy: (fields, ops) => ops.desc(fields.createdAt),
    offset: (c.var.pagination.currentPage - 1) * 20,
    limit: c.var.pagination.pageSize,
  })

  const expenses = getExpenses.map((e) => ({
    ...e,
    amount: formatCurrency(e.amount),
    date: e.date.toLocaleDateString("en-US", { dateStyle: "medium" }),
  }))

  return <ExpenseTableData data={expenses} />
}

async function ExpenseDataTablePagination() {
  const c = useRequestContext<DataTableMiddlewareVariables>()
  const pagination = c.var.pagination

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
