import z from 'zod'

export const AdsFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(2, 'Description is required').optional(),
  status: z.boolean().default(false),
  type: z.enum(['navbar', 'side']),
  cta_link: z.string().nullable(),
  cta_text: z.string().nullable()
})
export type AdsFormValues = z.infer<typeof AdsFormSchema>
