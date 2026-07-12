"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Course } from "../types/course";
import { useDeleteCourse } from "../hooks/use-delete-course";
import { resolveImageSrc } from "@/features/admin/courses/utils/resolve-image-src";

type CoursesTableProps = {
  courses: Course[];
  isLoading?: boolean;
};

function formatPrice(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";

  const numberValue = Number(value);

  return new Intl.NumberFormat("fa-IR").format(numberValue);
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("fa-IR").format(new Date(dateString));
}

function getStatusLabel(status: Course["status"]) {
  switch (status) {
    case "draft":
      return "پیش‌نویس";
    case "published":
      return "منتشر شده";
    case "archived":
      return "آرشیو شده";
    default:
      return status;
  }
}

function getStatusVariant(status: Course["status"]) {
  switch (status) {
    case "published":
      return "default" as const;
    case "draft":
      return "secondary" as const;
    case "archived":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function getTypeLabel(type: Course["type"]) {
  switch (type) {
    case "full_course":
      return "دوره کامل";
    case "mini_course":
      return "مینی دوره";
    default:
      return type;
  }
}

export function CoursesTable({
  courses,
  isLoading = false,
}: CoursesTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteMutation = useDeleteCourse();

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
    } catch (error) {
      console.error("حذف دوره با خطا مواجه شد", error);
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border text-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">ردیف</TableHead>
              <TableHead>تصویر دوره</TableHead>
              <TableHead>عنوان</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>نوع</TableHead>
              <TableHead>قیمت</TableHead>
              <TableHead>قیمت با تخفیف</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تاریخ انتشار</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {resolveImageSrc(course.cover_image) ? (
                      <img
                        src={resolveImageSrc(course.cover_image)!}
                        alt={course.title}
                        className="h-10 w-10 rounded-full inline object-cover border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                        ندارد
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category?.title ?? "-"}</TableCell>
                  <TableCell>{getTypeLabel(course.type)}</TableCell>
                  <TableCell>{formatPrice(course.price)}</TableCell>
                  <TableCell>{formatPrice(course.discount_price)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(course.status)}>
                      {getStatusLabel(course.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(course.published_at)}</TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">عملیات</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href={`/admin/courses/${course.id}/edit`}>
                            <Pencil className="ml-2 size-4" />
                            ویرایش
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(course.id)}
                        >
                          <Trash2 className="ml-2 size-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-muted-foreground h-28 text-center"
                >
                  هیچ دوره‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات قابل بازگشت نیست و دوره به صورت موقت حذف خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "در حال حذف..." : "بله، حذف شود"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
