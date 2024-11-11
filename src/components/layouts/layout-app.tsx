import type { PropsWithChildren } from "hono/jsx"

import { jsxRenderer, useRequestContext } from "hono/jsx-renderer"

export const _layoutApp = jsxRenderer(({ children, Layout, title }) => {
  return (
    <Layout title={title}>
      <LayoutApp>{children}</LayoutApp>
    </Layout>
  )
})

export function LayoutApp({ children }: PropsWithChildren) {
  return (
    <div class="isolate flex min-h-full flex-col">
      <AppHeader />
      <main class="container flex-1 pb-20 pt-8">{children}</main>
    </div>
  )
}

export default function AppHeader() {
  return (
    <header class="container sticky top-0 z-10 grid h-14 grid-cols-2 place-items-center border-b bg-white">
      <div class="flex items-center gap-x-2 justify-self-start">
        <a href={"/"}>
          <span class="text-sm font-semibold uppercase tracking-wide text-gray-950">
            Expense <span class="text-indigo-600">Tracker</span>
          </span>
        </a>
      </div>
      <div class="justify-self-end">
        <NavLink href="/" exact>
          Home
        </NavLink>
        <NavLink href="/expenses">Expenses</NavLink>
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  exact?: boolean
}

function NavLink({ href, exact, children }: PropsWithChildren<NavLinkProps>) {
  const pathname = useRequestContext().req.path
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <a
      href={href}
      class="px-3 py-2 text-sm font-medium text-gray-600 last:pr-0 hover:text-gray-950 aria-[current=page]:text-gray-950"
      {...(isActive && { "aria-current": "page" })}
    >
      {children}
    </a>
  )
}
