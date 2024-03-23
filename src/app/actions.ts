"use server";

import { cookies } from "next/headers";

export async function exampleAction() {
  // Get cookie
  const value = cookies().get("name")?.value;
  console.log(value);

  // Set cookie
  cookies().set("name", "Delba");

  // Delete cookie
  cookies().delete("name");
}
