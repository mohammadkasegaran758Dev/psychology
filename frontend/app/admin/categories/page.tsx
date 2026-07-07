import Link from "next/link";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { AdminPageShell } from "@/features/admin/sidebar/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

type Category = {
  id: number;
  name: string;
  slug: string;
  coursesCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

const mockCategories: Category[] = [
  {
    id: 1,
    name: "روانشناسی عمومی",
    slug: "general-psychology",
    coursesCount: 12,
    status: "active",
    createdAt: "1403/05/10",
  },
  {
    id: 2,
    name: "روانشناسی کودک",
    slug: "child-psychology",
    coursesCount: 8,
    status: "active",
    createdAt: "1403/05/15",
  },
  {
    id: 3,
    name: "مشاوره خانواده",
    slug: "family-counseling",
    coursesCount: 0,
    status: "inactive",
    createdAt: "1403/05/20",
  },
];

function getStatusLabel(status: Category["status"]) {
  return status === "active" ? "فعال" : "غیرفعال";
}

function getStatusVariant(status: Category["status"]) {
  return status === "active" ? "default" : "secondary";
}

export default function CategoriesPage() {
  const categories = mockCategories;

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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>نام</TableHead>
                  <TableHead>اسلاگ</TableHead>
                  <TableHead>تعداد دوره</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ ایجاد</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.length ? (
                  categories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.slug}
                      </TableCell>
                      <TableCell>{category.coursesCount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(category.status)}>
                          {getStatusLabel(category.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.createdAt}</TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">باز کردن عملیات</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/categories/${category.id}/edit`}
                              >
                                <Pencil className="ml-2 size-4" />
                                ویرایش
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
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
                      colSpan={7}
                      className="h-28 text-center text-muted-foreground"
                    >
                      هیچ دسته بندی‌ای یافت نشد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
