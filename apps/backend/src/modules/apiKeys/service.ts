import { prisma } from "db";
import { randomBytes } from "crypto";

export abstract class ApiKeyService {
  static async create(userId: string, name: string) {
    const apiKey = randomBytes(32).toString("hex");
    return prisma.apiKey.create({
      data: { userId, name, apiKey },
    });
  }

  static async list(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId, deleted: false },
      select: { id: true, name: true, disabled: true, apiKey: true },
    });
  }

  static async disable(userId: string, keyId: number) {
    return prisma.apiKey.update({
      where: { id: keyId, userId },
      data: { disabled: true },
    });
  }

  static async remove(userId: string, keyId: number) {
    return prisma.apiKey.update({
      where: { id: keyId, userId },
      data: { deleted: true },
    });
  }
}
