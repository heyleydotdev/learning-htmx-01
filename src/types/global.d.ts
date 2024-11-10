/* eslint-disable @typescript-eslint/no-empty-object-type */
import "typed-htmx"

declare module "hono/jsx" {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}

    interface IntrinsicElements {
      svg: HTMLAttributes
    }
  }
}

declare module "hono" {
  interface ContextRenderer {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    (content: string | Promise<string>, props?: { title?: string }): Response
  }
}
