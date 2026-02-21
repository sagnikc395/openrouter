import { prisma } from "db";

export abstract class AuthService {
  static async signup(email: string, password: string): Promise<string> {
    //check if the user with the email already exists
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return user.id;
  }
  static async signin(username: string, password: string): Promise<string> {}
}
