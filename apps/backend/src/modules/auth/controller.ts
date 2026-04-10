import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { signupSchema, signinSchema } from "./schema";
import { AuthService } from "./service";

export const AuthController = {
  async signup(req: Request, res: Response): Promise<void> {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });
      return;
    }

    try {
      const userId = await AuthService.signup(parsed.data.email, parsed.data.password);
      res.status(201).json({ id: userId });
    } catch {
      res.status(400).json({ message: "Error while signing up" });
    }
  },

  async signin(req: Request, res: Response): Promise<void> {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const { correctCredentials, userId } = await AuthService.signin(
      parsed.data.email,
      parsed.data.password,
    );

    if (!correctCredentials || !userId) {
      res.status(403).json({ message: "Incorrect credentials" });
      return;
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.cookie("auth", token, {
      httpOnly: true,
      maxAge: 7 * 86400 * 1000,
    });

    res.status(200).json({ message: "Signed in successfully" });
  },
};