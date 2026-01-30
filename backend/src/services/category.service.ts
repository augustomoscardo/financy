import type { CategoryInput } from "../dtos/input/category.input";
import { prismaClient } from "../lib/prisma";

export class CategoryService {
  async createCategory(data: CategoryInput, userId: string) {
    return await prismaClient.category.create({
      data: {
        name: data.name,
        description: data.description,
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

  async findCategoryById(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id
      }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (category.userId !== userId) {
      throw new Error("You don't have permission to access this category")
    }

    return category
  }

  async updateCategory(id: string, data: CategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id
      }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (category.userId !== userId) {
      throw new Error("You don't have permission to update this category")
    }

    return prismaClient.category.update({
      where: {
        id
      },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
      }
    })
  }

  async deleteCategory(categoryId: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId
      }
    })

    if (!category) {
      throw new Error("Category not found")
    }

    if (category.userId !== userId) {
      throw new Error("You don't have permission to delete this category")
    }

    return await prismaClient.category.delete({
      where: {
        id: categoryId
      }
    })
  }
}