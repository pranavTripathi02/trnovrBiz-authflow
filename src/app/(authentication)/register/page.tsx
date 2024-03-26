"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import VerifyMail from "./verifyMail";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const formSchema = z
  .object({
    name: z.string(),
    email: z
      .string({ required_error: "Enter your email" })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password should be at least 8 characters" })
      .max(16, { message: "Password cannot exceed 16 characters" })
      .trim(),
  })
  .strict({ message: "Invalid fields" });

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  // const mutation = api.users.register.useMutation();
  const [showVerify, setShowVerify] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userMail, setUserMail] = useState<string | null>(null);

  const mutation = api.user.register.useMutation();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, email, password } = data;
    await mutation.mutateAsync(
      { name, email, password },
      {
        onSuccess: (data) => {
          setUserMail(email);
          setUserId(data.userId);
          setShowVerify(true);
        },
      },
    );
  };

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.name) {
      router.push("/");
    }
  }, [user]);

  if (showVerify) {
    return <VerifyMail userId={userId!} userMail={userMail!} />;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
        <div>
          <label htmlFor="name" className="mb-2 block">
            Name
          </label>
          <input
            id="name"
            className="w-full rounded-md border px-4 py-2"
            {...register("name")}
            placeholder="Enter"
            disabled={mutation.isPending}
          />
          <p>{errors.name?.message}</p>
        </div>

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
          <input
            id="password"
            className="w-full rounded-md border px-4 py-2"
            {...register("password")}
            placeholder="Enter"
            type="password"
            disabled={mutation.isPending}
          />
          <p>{errors.password?.message}</p>
        </div>

        {mutation.isError && (
          <p className="text-center text-red-600">{mutation.error.message}</p>
        )}
        <button
          type="submit"
          className={`w-full rounded-md bg-black py-4 text-center font-medium uppercase text-white ${mutation.isPending ? "opacity-80" : "opacity-100"}`}
          disabled={mutation.isPending}
        >
          CREATE ACCOUNT
        </button>
        <p className="text-center text-[14px]">
          Have an Account?
          <Link href="/login" className="mx-2 font-medium uppercase">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
