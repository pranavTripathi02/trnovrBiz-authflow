"use client";

import useAuth from "@/hooks/useAuth";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

function HeaderAuth() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const handleLogout = async () => {
    deleteCookie("accessToken");
    checkAuth();
    router.refresh();
  };
  if (!user) return null;
  return (
    <div className="flex justify-end space-x-4 px-8 pt-2 text-xs text-neutral-500">
      <button>Help</button>
      <button>Orders & Returns</button>
      <button title="Logout" onClick={handleLogout}>
        Hi, {user.name}
      </button>
    </div>
  );
}

export default HeaderAuth;
