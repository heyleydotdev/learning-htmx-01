/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// @ts-nocheck

import "htmx.org/dist/htmx.esm"
import "htmx.org/dist/ext/response-targets"
import "htmx.org/dist/ext/loading-states"
import "node-snackbar/dist/snackbar"
import "nprogress/nprogress"

if (import.meta.env.DEV) {
  htmx.logAll()
}

NProgress.configure({
  showSpinner: false,
  speed: 200,
  template:
    '<div class="bar" role="bar" hx-history="false"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
})

const snackbar = (message: string) => {
  Snackbar.show({
    pos: "bottom-right",
    text: message,
    backgroundColor: "var(--toast-background-color)",
    actionTextColor: "var(--toast-dismiss-color)",
  })
}

const startNProgress = (event: Event) => {
  if (event.detail.boosted && event.detail.verb === "get") {
    NProgress.start()
  }
}

const stopNProgress = (event: Event) => {
  if (event.detail.boosted) {
    NProgress.done()
  }
}

document.addEventListener("htmx:configRequest", startNProgress)
document.addEventListener("htmx:afterRequest", stopNProgress)
document.addEventListener("htmx:responseError", stopNProgress)

const showSnackbar = (event: Event) => {
  const value = event.detail.value as unknown
  if (value && typeof value === "string") {
    snackbar(value)
  }
}

const showServerError = () => {
  snackbar("Something went wrong. Please try again in a moment.")
}

document.body.addEventListener("showSnackbar", showSnackbar)
document.body.addEventListener("serverError", showServerError)

window.addEventListener("beforeunload", () => {
  document.removeEventListener("htmx:configRequest", startNProgress)
  document.removeEventListener("htmx:afterRequest", stopNProgress)
  document.removeEventListener("htmx:responseError", stopNProgress)

  document.body.removeEventListener("showSnackbar", showSnackbar)
  document.body.removeEventListener("serverError", showServerError)
})
