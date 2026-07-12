import { z } from "zod";

export const courseSchema = z.object({
  // category_id: z.coerce.number().nullable().optional(),
  category_id: z.number().nullable().optional(),
  title: z
    .string()
    .min(1, "عنوان دوره الزامی است")
    .max(255, "عنوان دوره نباید بیشتر از ۲۵۵ کاراکتر باشد"),
  type: z.enum(["full_course", "mini_course"], {
    message: "نوع دوره را انتخاب کنید",
  }),
  short_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().min(0, "قیمت نمی‌تواند کمتر از صفر باشد"),
  // discount_price: z.union([z.coerce.number().min(0), z.null()]).optional(),
  discount_price: z.number().min(0).nullable().optional(),
  status: z.enum(["draft", "published", "archived"], {
    message: "وضعیت دوره را انتخاب کنید",
  }),
  cover_image: z.string().nullable().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
