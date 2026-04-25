import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthModel } from "./models";
import { AuthService } from "./service";
import {
  authenticateToken,
  AuthRequest,
} from "../../middleware/authMiddleware";

export const authRouter = Router();

authRouter.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const body = req.body as AuthModel.SignupSchema;
    const userId = await AuthService.signup(body.email, body.password);
    res.json({ id: userId });
  } catch {
    res.status(400).json({ message: "Error while signing up" });
  }
});

authRouter.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const body = req.body as AuthModel.SigninSchema;
    const { correctCredentials, userId } = await AuthService.signin(
      body.email,
      body.password,
    );
    if (correctCredentials && userId) {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      res.cookie("auth", token, {
        httpOnly: true,
        maxAge: 7 * 86400 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      res.json({ message: "Signed in successfully" });
    } else {
      res.status(403).json({ message: "Incorrect credentials" });
    }
  } catch {
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

authRouter.get(
  "/profile",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userData = await AuthService.getUserDetails(Number(req.userId));
      if (!userData) {
        return res
          .status(400)
          .json({ message: "Error while fetching user details" });
      }
      res.json(userData);
    } catch {
      res.status(400).json({ message: "Error while fetching user details" });
    }
  },
);

authRouter.post("/sign-out", async (_req: Request, res: Response) => {
  res.clearCookie("auth", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Signed out successfully" });
});
