/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// @ts-nocheck

import "htmx.org/dist/htmx.esm"
import "htmx.org/dist/ext/response-targets"
import "htmx.org/dist/ext/loading-states"
import "node-snackbar/dist/snackbar"

if (import.meta.env.DEV) {
  htmx.logAll()
}

document.body.addEventListener("serverError", () => {
  Snackbar.show({
    pos: "bottom-right",
    text: "Something went wrong. Please try again in a moment.",
    backgroundColor: "var(--toast-background-color)",
    actionTextColor: "var(--toast-dismiss-color)",
  })
})
