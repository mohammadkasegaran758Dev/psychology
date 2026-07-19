// src/features/auth/components/register-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useRegister } from "@/features/auth/hooks/use-register";
import { routes } from "@/lib/constants/routes";

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await register.mutateAsync({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      router.push(routes.home);
    } catch {
      // خطا از mutation قابل نمایش است
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm">Confirm Password</label>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {register.isError ? (
        <p className="text-sm text-red-500">
          ثبت‌نام ناموفق بود. لطفاً اطلاعات را بررسی کنید.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={register.isPending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {register.isPending ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
