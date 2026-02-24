import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuth } from "../middlewares/auth.middleware";
import { TransactionService } from "../services/transaction.service";
import { TransactionModel } from "../models/transaction.model";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from "../dtos/input/transaction.input";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { TransactionConnection } from "../dtos/output/transaction.output";


@Resolver(() => TransactionModel)
@UseMiddleware(isAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private userService = new UserService()
  private categoryService = new CategoryService

  @Query(() => [TransactionModel])
  async getTransactions(
    @GqlUser() user: User
  ) {
    return this.transactionService.getTransactionsByUserId(user.id)
  }

  @Query(() => TransactionConnection)
  async getTransactionsPaginated(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
    @Arg("filters", () => TransactionFilters, { nullable: true }) filters: TransactionFilters | undefined,
    @GqlUser() user: User
  ) {
    return this.transactionService.getTransactionsPaginated(user.id, page, limit, filters)
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: User
  ) {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: User
  ) {
    return this.transactionService.updateTransaction(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User
  ) {
    return this.transactionService.deleteTransaction(id, user.id)
  }

  @FieldResolver(() => UserModel)
  async user(@Root() transaction: TransactionModel): Promise<UserModel> {
    return this.userService.findUser(transaction.userId)
  }

  @FieldResolver(() => CategoryModel)
  async category(@Root() transaction: TransactionModel): Promise<CategoryModel> {
    return this.categoryService.findCategoryById(transaction.categoryId, transaction.userId)
  }
}