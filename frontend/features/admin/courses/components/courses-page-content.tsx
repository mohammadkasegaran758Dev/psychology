"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminPageShell } from "@/features/admin/sidebar";

import { useCourses } from "../hooks/use-courses";
import { CoursesTable } from "./courses-table";

export function CoursesPageContent() {
  const { data, isLoading } = useCourses();

  const courses = data?.data ?? [];

  return (
    <AdminPageShell
      title="دوره‌ها"
      description="مدیریت دوره‌های آموزشی"
      action={
        <Button asChild>
          <Link href="/admin/courses/create">
            <Plus className="size-4" />
            <span>ایجاد دوره</span>
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>لیست دوره‌ها</CardTitle>
          <CardDescription>
            مشاهده، ویرایش و حذف دوره‌های آموزشی
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CoursesTable courses={courses} isLoading={isLoading} />
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
