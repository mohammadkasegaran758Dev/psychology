// src/components/store/course-card.tsx

import Link from "next/link";
import type { Course } from "@/types/course";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CourseCard({ course }: { course: Course }) {
  const finalPrice = Number(course.final_price ?? course.price ?? 0);
  const isFree = course.is_free || finalPrice <= 0;
  const imageUrl = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL_Image}/storage/${course.thumbnail}`
    : "/placeholder-course.jpg";
  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <CardHeader className="relative h-48 overflow-hidden p-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          className="object-cover blur-xl scale-110"
        />

        {/* تصویر اصلی */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={course.title}
            width={320}
            height={180}
            unoptimized
            className="max-h-full max-w-full object-contain"
          />
        </div>
        {course.category?.title && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
            {course.category.title}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-1 text-lg">
          {course.title}
        </CardTitle>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {course.short_description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <span className="font-bold text-primary">
          {isFree ? "رایگان" : `${finalPrice.toLocaleString()} تومان`}
        </span>
        <Link href={`/courses/${course.slug}`}>
          <Button size="sm" variant="outline">
            مشاهده
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
