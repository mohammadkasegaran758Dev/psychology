// app/(store)/page.tsx
import Link from "next/link";

export default function StoreHomePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
          {/* متن معرفی فروشگاه */}
          <div className="space-y-6 text-center lg:text-right">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              فروشگاه دوره‌های روانشناسی
            </span>

            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold leading-relaxed tracking-tight sm:text-4xl lg:text-5xl">
                به فروشگاه دوره‌های{" "}
                <span className="text-primary">آموزشی روانشناسی</span> خوش آمدید
              </h1>

              <p className="mx-auto max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base lg:mx-0">
                دوره‌های تخصصی روانشناسی با امکان ثبت‌نام آنلاین، پیگیری پیشرفت
                و دسترسی به محتوای آموزشی، همه در یک پلتفرم.
              </p>
            </div>

            {/* CTAها: دیدن دوره‌ها و ورود کاربر */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/courses"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                مشاهده همه دوره‌ها
              </Link>

              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium transition hover:bg-accent"
              >
                ورود / ثبت‌نام
              </Link>
            </div>
          </div>

          {/* اینجا بعداً می‌توانی بخش‌های دیگر مثل لیست دوره‌های محبوب یا تصویر اضافه کنی */}
          {/* <StoreHeroIllustration /> یا یک کامپوننت Banner */}
        </div>
      </section>
    </main>
  );
}
