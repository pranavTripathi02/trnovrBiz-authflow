"use server";
import { api } from "@/trpc/server";

async function getUserSession() {
  console.log("getting it 1");
  try {
    const user = await api.user.getUserSession();
    console.log("getting it 2");
    return user;
  } catch (err) {
    console.log("this is the err", err);
    return null;
  }
}

export default getUserSession;
