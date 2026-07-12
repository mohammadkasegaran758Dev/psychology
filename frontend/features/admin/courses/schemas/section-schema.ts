import { z } from "zod";

export const sectionSchema = z.object({
  title: z.string().min(1, "عنوان سکشن الزامی است"),
  sort_order: z.number().int(),
});

export type SectionFormData = z.infer<typeof sectionSchema>;
