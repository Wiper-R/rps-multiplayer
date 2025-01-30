import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: new URL("api/v1/auth", window.location.href).href,
});
