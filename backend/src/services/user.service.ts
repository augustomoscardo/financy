import { prismaClient } from "../lib/prisma";

export class UserService {
  async listUsers() {
    return await prismaClient.user.findMany()
  }

  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new Error("User not found.")
    }

    return user
  }
}