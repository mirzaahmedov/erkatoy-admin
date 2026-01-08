import z from 'zod'

export const DisallowedWordFormSchema = z.object({
  word: z.string().min(1, 'Word is required')
})
export type DisallowedWordFormValues = z.infer<typeof DisallowedWordFormSchema>
