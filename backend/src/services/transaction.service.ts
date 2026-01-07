import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input";
import { prismaClient } from "../lib/prisma";

export class TransactionService {
  async createTransaction(data: CreateTransactionInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: data.categoryId
      }
    })

    if (!category) throw new Error("Category not found")

    if (category.userId !== userId) {
      throw new Error("You don't have permission to use this category")
    }

    return await prismaClient.transaction.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        type: data.type,
        date: data.date ?? undefined, // if undefined, prisma will set current date
        userId,
        categoryId: data.categoryId
      }
    })
  }

  async getTransactionsByUserId(userId: string) {
    return prismaClient.transaction.findMany({
      where: {
        userId
      }
    })
  }

  async getTransactionsByCategoryId(categoryId: string, categoryUserId: string, userId: string) {
    if (categoryUserId !== userId) {
      throw new Error("You don't have permission to access this category's transactions")
    }

    return prismaClient.transaction.findMany({
      where: {
        categoryId
      }
    })
  }

  async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id
      }
    })

    if (!transaction) throw new Error("Transaction not found")

    if (transaction.userId !== userId) {
      throw new Error("You don't have permission to update this transaction")
    }

    return prismaClient.transaction.update({
      where: {
        id
      },
      data: {
        title: data.title ?? transaction.title,
        description: data.description ?? transaction.description,
        amount: data.amount ?? transaction.amount,
        type: data.type ?? transaction.type,
        categoryId: data.categoryId ?? transaction.categoryId,
        date: data.date ?? transaction.date
      }
    })
  }

  async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id: transactionId
      }
    })

    if (!transaction) throw new Error("Transaction not found")

    if (transaction.userId !== userId) {
      throw new Error("You don't have permission to delete this transaction")
    }

    await prismaClient.transaction.delete({
      where: {
        id: transactionId
      }
    })

    return true
  }
}