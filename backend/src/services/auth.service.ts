import { User } from "@prisma/client";
import { prismaClient } from "../lib/prisma";
import { RegisterInput } from "../dtos/input/auth.input";
import { hashPassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error("An user with this email already exists.");
    }

    const passwordHashed = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHashed
      }
    })

    return this.generateTokens(user)
  }

  generateTokens(user: User) {
    try {
      const token = signJwt({ id: user.id, email: user.email }, '30m')
      const refreshToken = signJwt({ id: user.id, email: user.email }, '1d')

      return {
        token,
        refreshToken,
        user
      }
    } catch (error) {
      throw new Error("Error generating tokens.")
    }
  }
}