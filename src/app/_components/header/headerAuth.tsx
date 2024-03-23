"use client";

import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

function HeaderAuth({ name }: { name: string }) {
  const router = useRouter();
  const handleLogout = async () => {
    deleteCookie("accessToken");
    router.push("/login");
  };
  return (
    <div className="flex justify-end space-x-4 px-8 pt-2 text-xs text-neutral-500">
      <button>Help</button>
      <button>Orders & Returns</button>
      <button title="Logout" onClick={handleLogout}>
        Hi, {name}
      </button>
    </div>
  );
}

export default HeaderAuth;
