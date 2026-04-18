import { Router, Response } from "express";
import { PaymentsService } from "./service";
import {
  authenticateToken,
  AuthRequest,
} from "../../middleware/authMiddleware";

export const paymentsRouter = Router();

paymentsRouter.post(
  "/onramp",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const credits = await PaymentsService.onramp(Number(req.userId));
      res.json({ message: "Successfully onramped !", credits });
    } catch {
      res.status(411).json({ message: "Onramp Failed!", credits: 0 });
    }
  },
);
