import z from 'zod'

export const PostFormSchema = z.object({
  fio: z
    .string()
    .nonempty('Author is required')
    .min(1, 'Author is required')
    .max(255, 'Author must be at most 255 characters'),
  title: z
    .string()
    .nonempty('Title is required')
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  descr: z.string().optional(),
  image: z.file().optional(),
  gif: z.file().optional(),
  category_id: z.number().positive().int().optional(),
  content: z.string().nonempty('Content is required'),
  tags: z.array(z.number()).optional()
})
export type PostFormValues = z.infer<typeof PostFormSchema>
