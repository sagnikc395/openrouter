import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignupBody = z.infer<typeof signupSchema>;
export type SigninBody = z.infer<typeof signinSchema>;
