import z from "zod";

export const TagFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export type TagFormValues = z.infer<typeof TagFormSchema>;
