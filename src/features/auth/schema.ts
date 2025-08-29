import { z } from 'zod'

export const AuthFormSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(6).max(100)
})
export type AuthFormValues = z.infer<typeof AuthFormSchema>
