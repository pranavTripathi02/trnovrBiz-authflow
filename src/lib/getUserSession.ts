"use server";
import { api } from "@/trpc/server";
import { cookies } from "next/headers";

async function getUserSession() {
  try {
    const user = await api.user.getUserSession();
    return user;
  } catch (err) {
    console.error("Error getting session", err);
    return null;
  }
}

export const logoutUser = () => {
  cookies().delete("accessToken");
};

export default getUserSession;
