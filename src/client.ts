/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// @ts-nocheck

import "htmx.org/dist/htmx.esm"
import "htmx.org/dist/ext/response-targets"
import "htmx.org/dist/ext/loading-states"
import "node-snackbar/dist/snackbar"

const showSnackbar = (message: string) => {
  Snackbar.show({
    pos: "bottom-right",
    text: message,
    backgroundColor: "var(--toast-background-color)",
    actionTextColor: "var(--toast-dismiss-color)",
  })
}

document.body.addEventListener("showSnackbar", (event) => {
  if (event.detail.value) {
    showSnackbar(event.detail.value as string)
  }
})

document.body.addEventListener("serverError", () => {
  showSnackbar("Something went wrong. Please try again in a moment.")
})
