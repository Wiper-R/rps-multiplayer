import z from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().url(),
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export default envSchema.parse(process.env);
