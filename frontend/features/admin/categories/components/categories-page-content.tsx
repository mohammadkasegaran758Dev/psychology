"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { AdminPageShell } from "@/features/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { useCategories } from "../hooks/use-categories";
import { CategoriesTable } from "./categories-table";

export function CategoriesPageContent() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <AdminPageShell
      title="دسته بندی ها"
      description="مدیریت دسته بندی های دوره ها و محتوا"
      action={
        <Button asChild>
          <Link href="/admin/categories/create">
            <Plus className="size-4" />
            <span>ایجاد دسته بندی</span>
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>لیست دسته بندی ها</CardTitle>
              <CardDescription>
                مشاهده، ویرایش و مدیریت وضعیت دسته بندی ها
              </CardDescription>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2" />
              <Input placeholder="جستجو در دسته بندی ها..." className="pr-9" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CategoriesTable categories={categories} isLoading={isLoading} />
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
