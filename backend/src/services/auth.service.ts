import { User } from "@prisma/client";
import { prismaClient } from "../lib/prisma";
import { RegisterInput, type LoginInput } from "../dtos/input/auth.input";
import { comparePassword, hashPassword } from "../utils/hash";
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

  async login(data: LoginInput) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (!user) {
      throw new Error("User not registered..")
    }

    const isPasswordConfirmed = await comparePassword(data.password, user.password as string)

    if (!isPasswordConfirmed) {
      throw new Error("Invalid credentials.")
    }

    const userTokened = this.generateTokens(user)

    return userTokened
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