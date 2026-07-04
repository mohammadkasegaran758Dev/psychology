import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-center lg:text-right">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              پلتفرم مدیریت یادگیری روانشناسی
            </span>

            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold leading-relaxed tracking-tight sm:text-4xl lg:text-5xl">
                پنل مدیریت و فروش دوره‌های
                <span className="text-primary"> آموزشی روانشناسی </span>
              </h1>

              <p className="mx-auto max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base lg:mx-0">
                این سامانه برای مدیریت دسته‌بندی‌ها، دوره‌ها، ثبت‌نام‌ها،
                سفارش‌ها و تجربه کاربری دانشجویان طراحی شده است. از اینجا
                می‌توانید وارد بخش‌های مختلف سیستم شوید.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/admin"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                ورود به پنل ادمین
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium transition hover:bg-accent"
              >
                پنل کاربری
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="rounded-xl border bg-background p-4">
                <h2 className="mb-2 text-lg font-bold">ماژول‌های اصلی سیستم</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• مدیریت دسته‌بندی‌ها</li>
                  <li>• مدیریت دوره‌ها</li>
                  <li>• مدیریت سفارش‌ها</li>
                  <li>• مدیریت ثبت‌نام‌ها</li>
                  <li>• مدیریت کاربران و دانشجویان</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <h2 className="mb-2 text-lg font-bold">وضعیت توسعه</h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  زیرساخت فرانت‌اند پروژه با Next.js، TypeScript، shadcn/ui،
                  React Query و Axios آماده شده و در ادامه توسعه بخش مدیریت
                  دسته‌بندی‌ها انجام خواهد شد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
