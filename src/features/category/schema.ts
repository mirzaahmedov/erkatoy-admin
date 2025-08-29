import z from 'zod'

export const CategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean().optional().default(true)
})
export type CategoryFormValues = z.infer<typeof CategoryFormSchema>
