import type { HonoEnv } from "~/index"
import type { CreatePagination } from "~/lib/pagination"
import type { PropsWithChildren } from "hono/jsx"

import { createMiddleware } from "hono/factory"
import { useRequestContext } from "hono/jsx-renderer"
import { count, like } from "drizzle-orm"

import { ExpenseTableData, ExpenseTableRoot } from "~/components/segments/expense-table"
import { Card } from "~/components/shared/card"
import Input from "~/components/shared/input"
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
    pagination: ReturnType<CreatePagination> & {
      search: string
    }
  }
}

export const _dataTableMiddleware = createMiddleware<DataTableMiddlewareVariables>(async (c, next) => {
  const { page: currentPage, search } = _expenseTableQuerySchema.parse({
    page: c.req.query("page"),
    search: c.req.query("search"),
  })

  const totalItems = await c.var.db
    .select({ count: count() })
    .from(expensesTable)
    .where(like(expensesTable.expense, `%${search}%`))
    .then((count) => count[0]?.count ?? 0)

  const pagination = createPagination({ currentPage, totalItems, pageSize: 20, surroundBy: 2 })
  c.set("pagination", { ...pagination, search })
  return next()
})

export function ExpenseDataTable() {
  return (
    <div class="grid grid-cols-1 gap-y-6">
      <ExpenseDataTableSearch />
      <ExpenseDataTableOuter>
        <ExpenseDataTableInner />
      </ExpenseDataTableOuter>
      <ExpenseDataTablePagination />
    </div>
  )
}

export function ExpenseDataTableOuter({ children }: PropsWithChildren) {
  const c = useRequestContext<DataTableMiddlewareVariables>()
  const swapOob = String(c.req.header("hx-boosted")) !== "true" && { "hx-swap-oob": "true" }

  return (
    <Card class="p-0" id="expense-data-table" {...swapOob}>
      <ExpenseTableRoot>{children}</ExpenseTableRoot>
    </Card>
  )
}

export async function ExpenseDataTableInner() {
  const c = useRequestContext<DataTableMiddlewareVariables>()

  const getExpenses = await c.var.db.query.expensesTable.findMany({
    where: (fields, ops) => ops.like(fields.expense, `%${c.var.pagination.search}%`),
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

function ExpenseDataTableSearch() {
  const c = useRequestContext<DataTableMiddlewareVariables>()

  return (
    <div>
      <Input
        class="w-full max-w-72"
        type="search"
        name="search"
        hx-get="/expenses"
        hx-trigger="input changed delay:500ms, search"
        hx-push-url="true"
        placeholder="Search..."
        value={c.var.pagination.search}
      />
    </div>
  )
}

async function ExpenseDataTablePagination() {
  const c = useRequestContext<DataTableMiddlewareVariables>()
  const pagination = c.var.pagination
  const swapOob = String(c.req.header("hx-boosted")) !== "true" && { "hx-swap-oob": "true" }

  const searchParams = (page: number) => {
    const searchParams = new URLSearchParams({ search: pagination.search, page: String(page) })
    return `?${searchParams.toString()}`
  }

  return (
    <Pagination class="justify-end" id="expense-data-table-pagination" {...swapOob}>
      <PaginationContent>
        <PaginationPrevious
          href={pagination.hasPrevious ? searchParams(pagination.currentPage - 1) : "#"}
          active={pagination.isFirstPage}
          hx-swap="show:none"
        />
        {pagination.visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={pagination.currentPage === page ? "#" : searchParams(page)}
              active={pagination.currentPage === page}
              hx-swap="show:none"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext
          href={pagination.hasNext ? searchParams(pagination.currentPage + 1) : "#"}
          active={pagination.isLastPage || pagination.lastPage === 0}
          hx-swap="show:none"
        />
      </PaginationContent>
    </Pagination>
  )
}
