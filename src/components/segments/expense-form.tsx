import type { FormContextValues } from "~/components/shared/form"

import moment from "moment"

import Button from "~/components/shared/button"
import { Form, FormButton, FormControl, FormField, FormFieldset, FormLabel, FormMessage } from "~/components/shared/form"
import Input from "~/components/shared/input"

export default function CreateForm(props: FormContextValues) {
  const today = moment().utc().format("YYYY-MM-DD")

  return (
    <Form
      id="create-expense"
      hx-ext="response-targets"
      hx-put="/api/expenses"
      hx-swap="outerHTML focus-scroll:false"
      hx-target="this"
      hx-target-400="this"
      {...props}
    >
      <FormFieldset>
        <FormField name="expense">
          <FormLabel>Expense</FormLabel>
          <FormControl>
            {(props) => (
              <Input type="text" placeholder="e.g., Grocery Shopping, Monthly Rent, Coffee" required autofocus {...props} />
            )}
          </FormControl>
          <FormMessage />
        </FormField>
        <div class="grid grid-cols-2 gap-x-6 max-sm:contents">
          <FormField name="amount">
            <FormLabel>Amount</FormLabel>
            <FormControl>
              {(props) => <Input type="number" min={0} placeholder="100.75" step={0.01} required {...props} />}
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="date">
            <FormLabel>Date</FormLabel>
            <FormControl>{(props) => <Input type="date" max={today} value={today} required {...props} />}</FormControl>
            <FormMessage />
          </FormField>
        </div>

        <div class="flex items-center justify-end gap-3">
          <Button variant={"ghost"} type="reset">
            Reset Changes
          </Button>
          <FormButton type="submit">Save Expense</FormButton>
        </div>
      </FormFieldset>
    </Form>
  )
}
