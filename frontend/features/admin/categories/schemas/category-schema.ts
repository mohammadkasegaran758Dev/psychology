// import { z } from "zod";

// export const categorySchema = z.object({
//   name: z.string().min(2, "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد"),
//   slug: z
//     .string()
//     .min(2, "اسلاگ باید حداقل ۲ کاراکتر باشد")
//     .regex(
//       /^[a-z0-9-]+$/,
//       "اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره (-) باشد",
//     ),
//   description: z.string().optional(),
//   status: z.enum(["active", "inactive"]).default("active"),
// });

// export type CategoryFormValues = z.infer<typeof categorySchema>;

import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد")
    .max(100, "نام دسته‌بندی نباید بیشتر از ۱۰۰ کاراکتر باشد"),

  slug: z
    .string()
    .min(2, "اسلاگ باید حداقل ۲ کاراکتر باشد")
    .max(120, "اسلاگ نباید بیشتر از ۱۲۰ کاراکتر باشد")
    .regex(
      /^[a-z0-9-]+$/,
      "اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره (-) باشد",
    ),

  description: z
    .string()
    .max(1000, "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),

  status: z.enum(["active", "inactive"]).default("active"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
