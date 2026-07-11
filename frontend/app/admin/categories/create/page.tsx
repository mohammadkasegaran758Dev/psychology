"use client";

import { CategoryForm } from "@/features/admin/categories/components/category-form";
import { useCreateCategory } from "@/features/admin/categories/hooks/use-create-category";
import { AdminPageShell } from "@/features/admin/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  const handleSubmit = async (values: any) => {
    try {
      await createCategory.mutateAsync(values);
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
      router.push("/admin/categories");
    } catch (error) {
      toast.error("ایجاد دسته‌بندی با خطا مواجه شد");
      console.error(error);
    }
  };

  return (
    <AdminPageShell
      title="ایجاد دسته‌بندی"
      description="یک دسته‌بندی جدید برای دوره‌ها یا محتوای آموزشی ایجاد کنید."
    >
      <CategoryForm
        mode="create"
        isSubmitting={createCategory.isPending}
        onSubmit={handleSubmit}
      />
    </AdminPageShell>
  );
}
