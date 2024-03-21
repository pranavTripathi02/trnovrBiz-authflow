"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const formSchema = z
  .object({
    name: z.string().optional(),
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
  // const router = useRouter();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="rounded border border-2 ">
      <h1 className="text-lg">Create your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="block">
          Name
        </label>
        <input
          id="name"
          className="border"
          {...register("name")}
          placeholder="Enter"
        />
        <p>{errors.name?.message}</p>

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
        <input
          id="password"
          className="border"
          {...register("password")}
          placeholder="Enter"
        />
        <p>{errors.password?.message}</p>

        <button type="submit" className="w-full text-center uppercase">
          create account
        </button>
      </form>

      <p>
        Have an account?{" "}
        <Link href="/login" className="uppercase">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
