import type { CategoryInput } from "../dtos/input/category.input";
import { prismaClient } from "../lib/prisma";

export class CategoryService {
  async createCategory(data: CategoryInput, userId: string) {
    return prismaClient.category.create({
      data: {
        name: data.name,
        color: data.color,
        icon: data.icon,
        userId
      }
    })
  }

  async getCategoriesByUserId(userId: string) {
    return prismaClient.category.findMany({
      where: {
        userId
      }
    })
  }
}