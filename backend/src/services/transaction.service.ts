import { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from "../dtos/input/transaction.input";
import { prismaClient } from "../lib/prisma";
import { TransactionConnection } from "../dtos/output/transaction.output";
import { Prisma } from "@prisma/client";

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

  async countTransactionsByCategoryId(categoryId: string): Promise<number> {
    return prismaClient.transaction.count({
      where: {
        categoryId
      }
    })
  }

  async getTransactionsPaginated(
    userId: string,
    page: number,
    limit: number,
    filters?: TransactionFilters
  ): Promise<TransactionConnection> {
    // 1. Validar e normalizar inputs
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit)); // Máx 100 por página
    const skip = (validPage - 1) * validLimit;

    // 2. Construir where clause com filtros
    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (filters?.title) {
      where.title = {
        contains: filters.title,
      };
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    // 3. Executar queries em paralelo (otimização)
    const [transactions, totalItems] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        skip,
        take: validLimit,
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      }),
      prismaClient.transaction.count({ where }),
    ]);

    // 4. Calcular metadados de paginação
    const totalPages = Math.ceil(totalItems / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;

    // 5. Retornar resultado estruturado
    return {
      transactions,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: validLimit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}