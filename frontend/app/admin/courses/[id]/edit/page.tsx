// "use client";

// import { use } from "react";
// import { useRouter } from "next/navigation";

// import { AdminPageShell } from "@/features/admin/sidebar";
// import { CourseForm } from "@/features/admin/courses/components/course-form";
// import { useCourse } from "@/features/admin/courses/hooks/use-course";
// import { useUpdateCourse } from "@/features/admin/courses/hooks/use-update-course";

// type EditCoursePageProps = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export default function EditCoursePage({ params }: EditCoursePageProps) {
//   const router = useRouter();
//   const { id: rawId } = use(params);
//   const id = Number(rawId);

//   const courseQuery = useCourse(id);
//   const updateCourse = useUpdateCourse();

//   if (!Number.isFinite(id)) {
//     return <div>شناسه دوره نامعتبر است.</div>;
//   }

//   return (
//     <AdminPageShell
//       title="ویرایش دوره"
//       description="اطلاعات دوره را ویرایش کنید"
//     >
//       <CourseForm
//         initialData={courseQuery.data}
//         isLoading={courseQuery.isLoading}
//         isSubmitting={updateCourse.isPending}
//         onSubmit={async (values) => {
//           await updateCourse.mutateAsync({ id, values });
//           router.push("/admin/courses");
//         }}
//       />
//     </AdminPageShell>
//   );
// }
"use client";

import { use } from "react";

import { AdminPageShell } from "@/features/admin/sidebar";
import { CourseForm } from "@/features/admin/courses/components/course-form";
import { CourseSectionsManager } from "@/features/admin/courses/components/course-sections-manager";
import { useCourse } from "@/features/admin/courses/hooks/use-course";
import { useUpdateCourse } from "@/features/admin/courses/hooks/use-update-course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditCoursePage({ params }: EditCoursePageProps) {
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
      description="اطلاعات دوره و ساختار آموزشی آن را مدیریت کنید"
    >
      <Tabs dir="rtl" defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
          <TabsTrigger value="curriculum">سکشن‌ها و درس‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <CourseForm
            initialData={courseQuery.data}
            isLoading={courseQuery.isLoading}
            isSubmitting={updateCourse.isPending}
            onSubmit={async (values) => {
              await updateCourse.mutateAsync({ id, values });
            }}
          />
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            ابتدا سکشن بسازید، سپس داخل هر سکشن درس‌های مربوط به آن را اضافه
            کنید.
          </div>

          <CourseSectionsManager courseId={id} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}
