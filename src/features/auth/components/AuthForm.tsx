import type { AuthFormValues } from '../schema'

import { type FC, useState } from 'react'

import { Button, Checkbox, Form, Heading, TextField } from '@adobe/react-spectrum'
import { Controller, useForm } from 'react-hook-form'

export interface AuthFormProps {
  onSubmit: (data: AuthFormValues) => void
  isPending: boolean
}
export const AuthForm: FC<AuthFormProps> = ({ onSubmit, isPending }) => {
  const form = useForm<AuthFormValues>({
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const [isPasswordVisible, setPasswordVisible] = useState(false)

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Heading
        level={1}
        UNSAFE_className="text-4xl"
      >
        Sign In
      </Heading>
      <Controller
        control={form.control}
        name="username"
        render={({ field }) => (
          <TextField
            {...field}
            label="Username"
          />
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type={isPasswordVisible ? 'text' : 'password'}
          />
        )}
      />
      <Checkbox
        isSelected={isPasswordVisible}
        onChange={setPasswordVisible}
        name="password_visible"
      >
        Show Password
      </Checkbox>
      <Button
        type="submit"
        style="fill"
        variant="accent"
        isDisabled={isPending}
        isPending={isPending}
      >
        Continue
      </Button>
    </Form>
  )
}
