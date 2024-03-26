"use client";
import CategoryList from "./_components/categoryList";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.name) {
      router.push("/login");
    }
  }, [user]);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Please mark your interests!</h1>
      <p className="mb-8">We will keep you notified.</p>
      <div className="text-left">
        <h2 className="text-xl font-medium">My saved interests!</h2>
      </div>
      <CategoryList />
    </div>
  );
}
