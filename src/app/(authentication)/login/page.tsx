"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import useAuth from "@/hooks/useAuth";

const formSchema = z
  .object({
    email: z
      .string({ required_error: "Enter your email" })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password is required" })
      .trim(),
  })
  .strict({ message: "Invalid fields" });

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { user, checkAuth } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const handleShowPass = () => setShowPass((prev) => !prev);

  // const mutation = api.users.login.useMutation();
  // const router = useRouter();

  const mutation = api.user.login.useMutation();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    await mutation.mutateAsync(
      { email, password },
      {
        onSuccess: (data) => {
          setCookie("accessToken", data.accessToken);
          checkAuth();
          router.push("/");
        },
      },
    );
  };

  useEffect(() => {
    if (user?.name) {
      router.push("/");
    }
  }, [user]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Login</h1>
      <div className="mb-8 text-xl">
        <p>Welcome back to ECOMMERCE</p>
        <p className="text-sm">The next gen business marketplace</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
        <div>
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <input
            id="email"
            className="w-full rounded-md border px-4 py-2"
            {...register("email")}
            placeholder="Enter"
            disabled={mutation.isPending}
          />
          <p className="text-red-600">{errors.email?.message}</p>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              className="w-full rounded-md border px-4 py-2"
              {...register("password")}
              placeholder="Enter"
              autoComplete="current-password"
              type={showPass ? "text" : "password"}
              disabled={mutation.isPending}
            />
            <span
              className="absolute right-4 top-2 cursor-pointer select-none underline"
              onClick={(e) => {
                e.preventDefault();
                handleShowPass();
              }}
            >
              Show
            </span>
          </div>
          <p className="text-red-600">{errors.password?.message}</p>
        </div>

        {mutation.isError && (
          <p className="text-center text-red-600">{mutation.error.message}</p>
        )}
        {mutation.isSuccess && (
          <p className="text-center text-green-800">
            You are now logged in. Please wait while we redirect you. Refresh
            the page if it takes too long.
          </p>
        )}
        <button
          type="submit"
          className={`w-full rounded-md py-4 text-center font-medium uppercase ${mutation.isPending ? "cursor-progress bg-neutral-300 text-black" : "bg-black text-white"}`}
        >
          LOGIN
        </button>
        <span className="block w-full border-t" />
        <p className="text-center">
          Don&apos;t have an account?
          <Link href="/register" className="mx-2 font-medium uppercase">
            SIGN UP
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
