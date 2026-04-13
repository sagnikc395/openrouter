import { prisma } from "db";
import { jwt } from "@elysiajs/jwt";

export abstract class AuthService {
  static async signup(email: string, password: string): Promise<string> {
    //check if the user with the email already exist
    // good thing cause email is already unique
    const user = await prisma.user.create({
      data: {
        email,
        password: await Bun.password.hash(password),
      },
    });
    return user.id.toString();
  }
  static async signin(
    email: string,
    password: string,
  ): Promise<{ correctCredentials: boolean; userId?: string }> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { correctCredentials: false };
    }

    if (!(await Bun.password.verify(password, user.password))) {
      return { correctCredentials: false };
    }

    return { correctCredentials: true, userId: user.id.toString() };
  }

  static async getUserDetails(id: number) {
    return prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        credits: true,
      },
    });
  }
}
