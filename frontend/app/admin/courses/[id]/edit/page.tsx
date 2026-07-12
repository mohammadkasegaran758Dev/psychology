"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { AdminPageShell } from "@/features/admin/sidebar";
import { CourseForm } from "@/features/admin/courses/components/course-form";
import { useCourse } from "@/features/admin/courses/hooks/use-course";
import { useUpdateCourse } from "@/features/admin/courses/hooks/use-update-course";

type EditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  const { id: rawId } = use(params);
  const id = Number(rawId);

  const courseQuery = useCourse(id);
  const updateCourse = useUpdateCourse();

  if (!Number.isFinite(id)) {
    return <div>شناسه دوره نامعتبر است.</div>;
  }

  return (
    <AdminPageShell
      title="ویرایش دوره"
      description="اطلاعات دوره را ویرایش کنید"
    >
      <CourseForm
        initialData={courseQuery.data}
        isLoading={courseQuery.isLoading}
        isSubmitting={updateCourse.isPending}
        onSubmit={async (values) => {
          await updateCourse.mutateAsync({ id, values });
          router.push("/admin/courses");
        }}
      />
    </AdminPageShell>
  );
}
