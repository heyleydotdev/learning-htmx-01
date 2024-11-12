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
import { formatCurrency } from "~/lib/utils"

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

  const currentPage = Number(c.req.query("page") ?? 1)

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

  const currentPage = Number(c.req.query("page") ?? 1)

  const totalItems = await c.var.db
    .select({ count: count() })
    .from(expensesTable)
    .then((count) => count[0]?.count ?? 0)

  const pages = Math.ceil(totalItems / 20)

  return (
    <Pagination class="justify-end">
      <PaginationContent>
        <PaginationPrevious href={`?page=${currentPage - 1 || 1}`} hx-swap="show:none" />
        {Array.from({ length: pages }).map((_, page) => (
          <PaginationItem key={page + 1}>
            <PaginationLink href={`?page=${page + 1}`} hx-swap="show:none" active={currentPage === page + 1}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext href={`?page=${pages === currentPage ? pages : currentPage + 1}`} hx-swap="show:none" />
      </PaginationContent>
    </Pagination>
  )
}
