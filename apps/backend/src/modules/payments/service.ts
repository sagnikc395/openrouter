import { prisma } from "db";

//initial amount to be set for onramping
const ONRAMP_AMOUNT = 1000;

export abstract class PaymentsService {
  static async onramp(userId: number) {
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: ONRAMP_AMOUNT,
          },
        },
      }),

      prisma.onrampTransaction.create({
        data: {
          userId,
          amount: ONRAMP_AMOUNT,
          status: "completed",
        },
      }),
    ]);

    return user.credits;
  }
}
