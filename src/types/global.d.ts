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
