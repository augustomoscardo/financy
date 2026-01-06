import type { CategoryInput } from "../dtos/input/category.input";
import { prismaClient } from "../lib/prisma";

export class CategoryService {
  async createCategory(data: CategoryInput, userId: string) {
    return await prismaClient.category.create({
      data: {
        name: data.name,
        color: data.color,
        icon: data.icon,
        userId
      }
    })
  }

  async getCategoriesByUserId(userId: string) {
    return await prismaClient.category.findMany({
      where: {
        userId
      }
    })
  }

  async findCategoryById(id: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id
      }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    return category
  }

  async updateCategory(id: string, data: CategoryInput) {
    const category = await prismaClient.category.findUnique({
      where: {
        id
      }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    return prismaClient.category.update({
      where: {
        id
      },
      data: {
        name: data.name,
        color: data.color,
        icon: data.icon,
      }
    })
  }

  async deleteCategory(categoryId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId
      }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    return await prismaClient.category.delete({
      where: {
        id: categoryId
      }
    })
  }
}