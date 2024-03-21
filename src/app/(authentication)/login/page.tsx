"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="rounded border border-2 ">
      <h1 className="text-xl font-bold">Login</h1>
      <div>
        <p>Welcome back to ECOMMERCE</p>
        <p className="text-sm">The next gen business marketplace</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="block">
          Email
        </label>
        <input
          id="email"
          className="border"
          {...register("email")}
          placeholder="Enter"
        />
        <p>{errors.email?.message}</p>

        <label htmlFor="password" className="block">
          Password
        </label>
        <div className="relative w-fit border">
          <input
            id="password"
            className="border"
            {...register("password")}
            placeholder="Enter"
            autoComplete="current-password"
            type={showPass ? "text" : "password"}
          />
          <button
            className="absolute right-0 underline"
            onClick={handleShowPass}
          >
            show
          </button>
        </div>
        <p>{errors.password?.message}</p>

        <button type="submit" className="w-full text-center uppercase">
          LOGIN
        </button>
      </form>

      <p>
        Don&apos;t have an account?{" "}
        <Link href="/register" className="uppercase">
          SIGN UP
        </Link>
      </p>
    </div>
  );
}

export default Login;
