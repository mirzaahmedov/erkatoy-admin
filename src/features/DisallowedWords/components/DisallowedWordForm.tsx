import type { DisallowedWordFormValues } from '../schema'

import { type FC, type ReactNode } from 'react'

import { TextField } from '@adobe/react-spectrum'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'
import { Form } from 'react-router-dom'

const defaultValues: DisallowedWordFormValues = {
  word: ''
}

export const DisallowedWordForm: FC<{
  onSubmit: (
    values: DisallowedWordFormValues,
    form: UseFormReturn<DisallowedWordFormValues>
  ) => void
  isPending: boolean
  actions: (form: UseFormReturn<DisallowedWordFormValues>) => ReactNode
}> = (props) => {
  const { onSubmit, isPending, actions } = props

  const form = useForm<DisallowedWordFormValues>({
    disabled: isPending,
    defaultValues
  })

  return (
    <Form
      onSubmit={form.handleSubmit((values) => onSubmit(values, form))}
      className="flex flex-col gap-2.5"
    >
      <Controller
        control={form.control}
        name="word"
        render={({ field }) => (
          <TextField
            {...field}
            label="Word"
            width="100%"
          />
        )}
      />
      {actions(form)}
    </Form>
  )
}
