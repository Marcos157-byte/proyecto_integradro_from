// auth.ts
import client from "./client";

export async function login(email: string, password: string) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

export async function me() {
  const { data } = await client.get("/auth/me");
  return data;
}