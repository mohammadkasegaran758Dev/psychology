// src/app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "کل دوره‌ها",
      value: "۱۲",
      icon: BookOpen,
      desc: "+۲ دوره جدید در این ماه",
    },
    {
      title: "کل دانشجویان",
      value: "۱,۴۲۰",
      icon: Users,
      desc: "+۱۲٪ رشد نسبت به ماه گذشته",
    },
    {
      title: "سفارشات جدید",
      value: "۴۵",
      icon: ShoppingBag,
      desc: "۱۸ سفارش در انتظار تأیید",
    },
    {
      title: "درآمد کل",
      value: "۱۲۴,۰۰۰,۰۰۰ تومان",
      icon: DollarSign,
      desc: "+۸٪ افزایش سود",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          خلاصه وضعیت داشبورد
        </h2>
        <p className="text-muted-foreground">
          گزارشات و آمارهای کلی سیستم آموزشی در یک نگاه.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
