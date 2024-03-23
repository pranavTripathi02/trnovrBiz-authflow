"use server";

import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type UserJWTPayload = {
  userId: number;
  userName: string;
};

export async function setToken(token: string) {
  console.log("setting cookie");
  cookies().set("accessToken", token, {
    expires: 15 * 60 * 1000,
    httpOnly: true,
    path: "/",
  });
}

export async function verifyToken() {
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) {
    throw new TRPCError({
      message: "Token does not exist",
      code: "BAD_REQUEST",
    });
  }
  try {
    const verified = jwt.verify(accessToken, env.JWT_SECRET);
    return verified as UserJWTPayload;
  } catch (err) {
    console.log(err);
    throw new TRPCError({
      message: "Token invalid",
      code: "UNAUTHORIZED",
    });
  }
}
