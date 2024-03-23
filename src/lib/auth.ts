import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type UserJWTPayload = {
  id: number;
  name: string;
};

export async function verifyToken() {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    throw new TRPCError({
      message: "Token does not exist",
      code: "BAD_REQUEST",
    });
  }
  const verified = jwt.verify(accessToken, env.JWT_SECRET);
  return verified as UserJWTPayload;
}
