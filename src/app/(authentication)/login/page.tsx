"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";


const formSchema = z
  .object({
    email: z
      .string({ required_error: "Enter your email" })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z.string({ required_error: "Password is required" }).trim(),
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

  const [showPass, setShowPass] = useState(false);
  const handleShowPass = () => setShowPass((prev) => !prev);

  // const mutation = api.users.login.useMutation();
  // const router = useRouter();

  const mutation = api.user.login.useMutation();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    await mutation.mutateAsync({ email, password },{onSuccess(data, variables, context) {
        
    },);
  };

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
          <p>{errors.email?.message}</p>
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
            <button
              className="absolute right-4 top-2 underline"
              onClick={handleShowPass}
            >
              Show
            </button>
          </div>
          <p>{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className={`w-full rounded-md bg-black py-4 text-center font-medium uppercase text-white ${mutation.isPending ? "opacity-80" : "opacity-100"}`}
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
