import type { PropsWithChildren } from "hono/jsx"

import AppHeader from "~/components/app-header"

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div class="flex min-h-full flex-col">
      <AppHeader />
      <main class="container flex-1 pb-20 pt-8">{children}</main>
    </div>
  )
}
