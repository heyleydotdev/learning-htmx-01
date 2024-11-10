/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import "htmx.org/dist/htmx.esm";
import 'htmx.org/dist/ext/loading-states'

if(import.meta.env.DEV) {
  // @ts-expect-error
  htmx.logAll();
}

// TODO: show toast or something 
document.body.addEventListener('serverError', () => {
  alert('serverError')
})