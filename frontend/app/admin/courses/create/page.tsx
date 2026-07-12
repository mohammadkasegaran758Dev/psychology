"use client";

import { useRouter } from "next/navigation";

import { AdminPageShell } from "@/features/admin/sidebar";
import { CourseForm } from "@/features/admin/courses/components/course-form";
import { useCreateCourse } from "@/features/admin/courses/hooks/use-create-course";

export default function CreateCoursePage() {
  const router = useRouter();
  const createCourse = useCreateCourse();

  return (
    <AdminPageShell
      title="ایجاد دوره"
      description="اطلاعات دوره جدید را وارد کنید"
    >
      <CourseForm
        isSubmitting={createCourse.isPending}
        onSubmit={async (values) => {
          await createCourse.mutateAsync(values);
          router.push("/admin/courses");
        }}
      />
    </AdminPageShell>
  );
}
