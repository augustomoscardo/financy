import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { CategoryInput } from "../dtos/input/category.input";
import { isAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { TransactionModel } from "../models/transaction.model";
import { TransactionService } from "../services/transaction.service";


@Resolver(() => CategoryModel)
@UseMiddleware(isAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()
  private userService = new UserService()
  private transactionService = new TransactionService()

  @Query(() => [CategoryModel])
  async getCategories(
    @GqlUser() user: User
  ): Promise<CategoryModel[]> {
    return this.categoryService.getCategoriesByUserId(user.id)
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg("data", () => CategoryInput) data: CategoryInput,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg("id", () => String) id: string,
    @Arg("data", () => CategoryInput) data: CategoryInput,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User
  ) {
    await this.categoryService.deleteCategory(id, user.id)
    return true
  }

  @FieldResolver(() => UserModel)
  async user(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.findUser(category.userId)
  }

  @FieldResolver(() => [TransactionModel])
  async transactions(
    @Root() category: CategoryModel,
    @GqlUser() user: User
  ): Promise<TransactionModel[]> {
    return this.transactionService.getTransactionsByCategoryId(category.id, category.userId, user.id)
  }
}