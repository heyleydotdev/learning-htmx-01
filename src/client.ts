/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// @ts-nocheck

import "htmx.org/dist/htmx.esm";
import 'htmx.org/dist/ext/response-targets'

if(import.meta.env.DEV) {
  htmx.logAll();
}