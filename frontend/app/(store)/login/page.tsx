// src/app/(store)/login/page.tsx
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <LoginForm />
    </div>
  );
}
