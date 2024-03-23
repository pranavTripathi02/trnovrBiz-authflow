import getUserSession from "@/lib/getUserSession";
import CategoryList from "./_components/categoryList";
import { redirect } from "next/navigation";

export default async function Home() {
  const userSession = await getUserSession();
  if (!userSession) {
    redirect("/login");
  }
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
