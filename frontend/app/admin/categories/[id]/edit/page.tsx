"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCategory } from "@/features/admin/categories";
import { useUpdateCategory } from "@/features/admin/categories/hooks/use-update-category";
import { AdminPageShell } from "@/features/admin/sidebar";
import { CategoryForm } from "@/features/admin/categories/components/category-form";
import { use } from "react";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter();
  const { id: rawId } = use(params);
  const id = Number(rawId);

  const categoryQuery = useCategory(id);
  const updateCategory = useUpdateCategory();

  const handleSubmit = async (values: any) => {
    try {
      await updateCategory.mutateAsync({ id, values });
      toast.success("دسته‌بندی با موفقیت ویرایش شد");
      router.push("/admin/categories");
    } catch (error) {
      toast.error("ویرایش دسته‌بندی با خطا مواجه شد");
      console.error(error);
    }
  };
  console.log("categoryQuery", categoryQuery);
  if (categoryQuery.isLoading) {
    return (
      <AdminPageShell
        title="ویرایش دسته‌بندی"
        description="در حال دریافت اطلاعات دسته‌بندی..."
      >
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AdminPageShell>
    );
  }

  if (categoryQuery.isError || !categoryQuery.data) {
    return (
      <AdminPageShell
        title="ویرایش دسته‌بندی"
        description="امکان دریافت اطلاعات این دسته‌بندی وجود ندارد."
      >
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          بارگذاری اطلاعات دسته‌بندی با خطا مواجه شد.
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="ویرایش دسته‌بندی"
      description="اطلاعات دسته‌بندی را بروزرسانی کنید."
    >
      <CategoryForm
        mode="edit"
        defaultValues={{
          title: categoryQuery?.data?.data?.title,
          slug: categoryQuery?.data?.data?.slug,
          description: categoryQuery?.data?.data?.description ?? "",
          is_active: categoryQuery?.data?.data.is_active,
        }}
        isSubmitting={updateCategory.isPending}
        onSubmit={handleSubmit}
      />
    </AdminPageShell>
  );
}
