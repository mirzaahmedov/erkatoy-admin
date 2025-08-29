import z from "zod";

export const PostFormSchema = z.object({
  fio: z.string().min(2, "FIO is required"),
  title: z.string().min(2, "Title is required"),
  descr: z.string().min(2, "Description is required").optional(),
  image: z.file().optional(),
  category_id: z.number().min(1, "Category is required").optional(),
  content: z.string().min(10, "Content is required"),
  tags: z.array(z.number()).optional(),
});
export type PostFormValues = z.infer<typeof PostFormSchema>;
