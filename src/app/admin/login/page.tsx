"use client";

import React, { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await loginAction(formData);
      if (response?.error) {
        setError(response.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-950 px-4 text-black dark:text-white">
      <div className="w-full max-w-md space-y-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-8 rounded-sm shadow-2xl">
        <div className="text-center">
          <img
            src="/images/logo-og.png"
            alt="NETHIEL Logo"
            className="h-12 sm:h-14 w-auto mx-auto object-contain"
          />
          <p className="mt-2 text-xs tracking-[0.25em] text-neutral-600 dark:text-neutral-400 uppercase">
            Admin Console Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 p-3 text-xs tracking-wide text-red-600 dark:text-red-500 rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-light tracking-widest uppercase text-neutral-600 dark:text-neutral-400"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                disabled={isPending}
                className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 transition-colors focus:border-black dark:focus:border-white focus:outline-none"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-light tracking-widest uppercase text-neutral-600 dark:text-neutral-400"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  disabled={isPending}
                  className="block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 pl-3 pr-10 py-2 text-sm text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 transition-colors focus:border-black dark:focus:border-white focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-sm bg-black dark:bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:text-black transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-700 dark:text-neutral-300"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
