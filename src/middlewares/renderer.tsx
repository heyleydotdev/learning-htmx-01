import { jsxRenderer } from "hono/jsx-renderer"

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html class="h-full">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {import.meta.env.PROD ? (
          <>
            <link rel="stylesheet" href="/static/assets/globals.css" />
            <link rel="preload" href="/static/client.js" as="script" />

            <script type="module" src="/static/client.js" defer />
          </>
        ) : (
          <>
            <link rel="stylesheet" href="/src/assets/styles/globals.css" />
            <link rel="preload" href="/src/client.ts" as="script" />

            <script type="module" src="/src/client.ts" defer />
          </>
        )}
      </head>
      <body class="h-full bg-white p-4 text-gray-600 antialiased">{children}</body>
    </html>
  )
})
