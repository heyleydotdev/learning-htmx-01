import type { ButtonProps } from "~/components/shared/button"
import type { LabelProps } from "~/components/shared/label"
import type { FixKeyIssue } from "~/types/types"
import type { Child, JSX, PropsWithChildren } from "hono/jsx"
import type { ParsedFormValue } from "hono/types"

import { createContext, Fragment, useContext, useId } from "hono/jsx"

import Button from "~/components/shared/button"
import Label from "~/components/shared/label"
import Spinner from "~/components/shared/spinner"
import { cn } from "~/lib/utils"

export type FormContextValues = {
  prevState?: Record<string, ParsedFormValue | ParsedFormValue[]>
  errors?: Record<string, string>
}
export type FormProps = JSX.IntrinsicElements["form"] & FormContextValues

const FormContext = createContext<FormContextValues>({} as FormContextValues)

const Form = ({ "hx-ext": hx_ext, prevState, errors, ...rest }: JSX.IntrinsicElements["form"] & FormContextValues) => {
  const exts = [hx_ext, "loading-states"].filter(Boolean).join(",")

  return (
    <FormContext.Provider value={{ prevState, errors }}>
      <form hx-ext={exts} data-loading-states {...rest} />
    </FormContext.Provider>
  )
}

const FormFieldset = ({ class: className, ...rest }: JSX.IntrinsicElements["fieldset"]) => {
  return <fieldset class={cn("grid gap-y-6", className)} data-loading-disable {...rest} />
}

type FormFieldContextValues = { id: string; name: string }
const FormFieldContext = createContext<FormFieldContextValues>({} as FormFieldContextValues)

const useFormField = () => {
  const formContext = useContext(FormContext)
  const fieldContext = useContext(FormFieldContext)
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  return {
    ...fieldContext,
    fieldId: `${fieldContext.id}-form-field`,
    fieldMessageId: `${fieldContext.id}-form-field-message`,
    prevState: formContext?.prevState?.[fieldContext.name] ?? undefined,
    error: formContext?.errors?.[fieldContext.name] ?? null,
  }
}

type FormFieldProps = JSX.IntrinsicElements["div"] & Omit<FormFieldContextValues, "id">

const FormField = ({ name, class: className, ...rest }: FormFieldProps) => {
  const id = useId()

  return (
    <FormFieldContext.Provider value={{ id, name }}>
      <div class={cn("grid grid-cols-1 gap-y-2", className)} {...rest} />
    </FormFieldContext.Provider>
  )
}

const FormLabel = ({ for: htmlFor, ...rest }: FixKeyIssue<LabelProps>) => {
  const { fieldId } = useFormField()

  return <Label for={htmlFor ?? fieldId} {...rest} />
}

type ControlProps = Pick<FormFieldContextValues, "name" | "id">

interface FormControlProps {
  children: Child | ((props: ControlProps) => Child)
}

const FormControl = ({ children }: FormControlProps) => {
  const { name, fieldId, prevState, fieldMessageId, error } = useFormField()

  const values = {
    name,
    id: fieldId,
    "aria-describedby": error ? fieldMessageId : undefined,
    "aria-invalid": !!error,
    ...(!!prevState && { value: prevState }),
  }

  return <Fragment>{typeof children === "function" ? children(values) : children}</Fragment>
}

const FormMessage = ({ class: className, ...rest }: JSX.IntrinsicElements["p"]) => {
  const { error, fieldMessageId } = useFormField()

  if (!error) {
    return null
  }

  return (
    <p id={fieldMessageId} class={cn("text-[0.825rem]/6 font-medium text-red-600", className)} {...rest}>
      {error}
    </p>
  )
}

const FormButton = ({ children, type, ...rest }: PropsWithChildren<FixKeyIssue<ButtonProps>>) => {
  return (
    <Button type={type ?? "submit"} {...rest}>
      <Spinner class="invisible absolute" data-loading-class-remove="invisible" data-loading-class="visible" />
      <span class="contents" data-loading-class="invisible">
        {children}
      </span>
    </Button>
  )
}

export { Form, FormButton, FormControl, FormField, FormFieldset, FormLabel, FormMessage }
