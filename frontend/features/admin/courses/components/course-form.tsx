"use client";

import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { courseSchema, type CourseFormValues } from "../schemas/course-schema";
import type { Course } from "../types/course";
import { coursesApi } from "../services/courses-api";
import { ImageUploader } from "@/features/admin/uploads/components/image-uploader";

type CourseFormProps = {
  initialData?: Course;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: CourseFormValues) => Promise<void> | void;
};

export function CourseForm({
  initialData,
  isLoading = false,
  isSubmitting = false,
  onSubmit,
}: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      category_id: initialData?.category_id ?? null,
      title: initialData?.title ?? "",
      type: initialData?.type ?? "full_course",
      short_description: initialData?.short_description ?? "",
      description: initialData?.description ?? "",
      price:
        initialData?.price !== undefined && initialData?.price !== null
          ? Number(initialData.price)
          : 0,
      discount_price:
        initialData?.discount_price !== undefined &&
        initialData?.discount_price !== null
          ? Number(initialData.discount_price)
          : null,
      status: initialData?.status ?? "draft",
      cover_image: initialData?.cover_image ?? "",
    },
    values: initialData
      ? {
          category_id: initialData.category_id ?? null,
          title: initialData.title ?? "",
          type: initialData.type ?? "full_course",
          short_description: initialData.short_description ?? "",
          description: initialData.description ?? "",
          price:
            initialData.price !== undefined && initialData.price !== null
              ? Number(initialData.price)
              : 0,
          discount_price:
            initialData.discount_price !== undefined &&
            initialData.discount_price !== null
              ? Number(initialData.discount_price)
              : null,
          status: initialData.status ?? "draft",
          cover_image: initialData.cover_image ?? "",
        }
      : undefined,
  });

  const categoryOptionsQuery = useQuery({
    queryKey: ["admin", "categories", "options"],
    queryFn: () => coursesApi.getCategoryOptions(),
  });

  const handleSubmit = async (values: CourseFormValues) => {
    await onSubmit({
      ...values,
      short_description: values.short_description || null,
      description: values.description || null,
      cover_image: values.cover_image || null,
      category_id:
        values.category_id === undefined ||
        values.category_id === null ||
        Number(values.category_id) === 0
          ? null
          : Number(values.category_id),
      discount_price:
        values.discount_price === undefined ||
        values.discount_price === null ||
        Number.isNaN(Number(values.discount_price))
          ? null
          : Number(values.discount_price),
      price: Number(values.price),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          در حال دریافت اطلاعات...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان دوره</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلاً روانشناسی رشد" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>دسته‌بندی</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? null : Number(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="یک دسته‌بندی انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">بدون دسته‌بندی</SelectItem>
                        {categoryOptionsQuery.data?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع دوره</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="نوع دوره را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full_course">دوره کامل</SelectItem>
                        <SelectItem value="mini_course">مینی دوره</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وضعیت</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="وضعیت را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">پیش‌نویس</SelectItem>
                        <SelectItem value="published">منتشر شده</SelectItem>
                        <SelectItem value="archived">آرشیو شده</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="مثلاً 1200000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت با تخفیف</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="اختیاری"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس تصویر کاور</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="مسیر فایل آپلود شده"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      uploadType="course_image"
                      disabled={isSubmitting}
                      label="تصویر کاور دوره"
                      hint="بعد از انتخاب فایل، آپلود انجام می‌شود و مسیر در cover_image ذخیره می‌گردد."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیح کوتاه</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="توضیح کوتاه دوره"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات کامل</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      placeholder="توضیحات کامل دوره"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
