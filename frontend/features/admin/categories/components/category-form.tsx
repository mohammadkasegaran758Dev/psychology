"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category-schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryFormProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<CategoryFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoryForm({
  mode = "create",
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: CategoryFormProps) {
  const initialValues = useMemo<CategoryFormValues>(
    () => ({
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? "active",
    }),
    [defaultValues],
  );

  const form = useForm<CategoryFormValues>({
    // zodResolver's inferred generics can conflict with react-hook-form's
    // types in some versions. Cast via `unknown` to a typed `Resolver` to
    // avoid `any` while keeping runtime validation via Zod.
    resolver: zodResolver(
      categorySchema,
    ) as unknown as Resolver<CategoryFormValues>,
    defaultValues: initialValues,
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  const handleAutoGenerateSlug = () => {
    if (!nameValue) return;
    form.setValue("slug", slugify(nameValue), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitLabel = mode === "create" ? "ایجاد دسته‌بندی" : "ذخیره تغییرات";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "ایجاد دسته‌بندی جدید" : "ویرایش دسته‌بندی"}
        </CardTitle>
        <CardDescription>
          اطلاعات دسته‌بندی را تکمیل کنید و سپس ذخیره نمایید.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام دسته‌بندی</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلاً روانشناسی کودک" {...field} />
                    </FormControl>
                    <FormDescription>
                      نامی که در پنل و سایت نمایش داده می‌شود.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسلاگ</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          dir="ltr"
                          placeholder="child-psychology"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAutoGenerateSlug}
                        >
                          ساخت خودکار
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      فقط حروف کوچک انگلیسی، عدد و `-`
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="توضیح کوتاهی درباره این دسته‌بندی بنویسید..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>این فیلد اختیاری است.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
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
                        <SelectItem value="active">فعال</SelectItem>
                        <SelectItem value="inactive">غیرفعال</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      فقط دسته‌بندی‌های فعال در بخش‌های عمومی قابل استفاده
                      خواهند بود.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">پیش‌نمایش داده</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">نام:</span>{" "}
                      {nameValue || "—"}
                    </p>
                    <p dir="ltr">
                      <span className="font-medium text-foreground">Slug:</span>{" "}
                      {slugValue || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        وضعیت:
                      </span>{" "}
                      {form.watch("status") === "active" ? "فعال" : "غیرفعال"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline">
                انصراف
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>در حال ذخیره...</span>
                  </>
                ) : (
                  <span>{submitLabel}</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
