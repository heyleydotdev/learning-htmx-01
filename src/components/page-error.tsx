import { css, Style } from "hono/css"

export default function ErrorPage() {
  return (
    <html
      class={css`
        height: 100%;
      `}
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Internal Server Error</title>

        <Style />
      </head>
      <body
        class={css`
          font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-height: 100%;
          color: #000;
          background-color: #ffffff;
        `}
      >
        <h2
          class={css`
            all: unset;
            font-size: 1rem;
            line-height: 1.5rem;
            font-weight: 700;
          `}
        >
          Something Went Wrong
        </h2>
        <p
          class={css`
            all: unset;
            font-size: 0.875rem;
            line-height: 1.5rem;
            color: #4b5563;
          `}
        >
          Something went wrong. Please try again in a moment.
        </p>
      </body>
    </html>
  )
}
