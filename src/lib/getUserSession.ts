"use server";
import { api } from "@/trpc/server";

async function getUserSession() {
  try {
    const user = await api.user.getUserSession();
    return user;
  } catch (err) {
    console.error("Error getting session", err);
    return null;
  }
}

export default getUserSession;
