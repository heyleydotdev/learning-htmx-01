import { jsxRenderer } from "hono/jsx-renderer"

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html class="h-full">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Expense Tracker</title>

        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💲</text></svg>"
        />
        <link rel="preload" as="font" href="/static/inter_var.woff2" type="font/woff2" crossorigin="" />

        {import.meta.env.PROD ? (
          <>
            <link rel="stylesheet" href="/static/assets/globals.css" />
            <script type="module" src="/static/client.js" />
          </>
        ) : (
          <>
            <link rel="stylesheet" href="/src/assets/styles/globals.css" />
            <script type="module" src="/src/client.ts" />
          </>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `@font-face{font-family:InterVariable;font-style:normal;font-weight:100 900;font-display:swap;src:url('/static/inter_var.woff2') format('woff2')}`,
          }}
        />
      </head>
      <body class="h-full bg-white font-sans text-gray-600 antialiased">{children}</body>
    </html>
  )
})
