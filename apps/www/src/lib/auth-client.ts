import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http:/localhost:5173/api/v1/auth",
});
