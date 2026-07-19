// src/app/(store)/register/page.tsx
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>
      <RegisterForm />
    </div>
  );
}
