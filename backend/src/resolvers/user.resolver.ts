import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';

@Resolver()
export class UserResolver {
  private userService = new UserService()

  @Query(() => UserModel)
  async getUser(@Arg("id", () => String) id: string): Promise<UserModel> {
    return this.userService.findUser(id)
  }

  @Query(() => [UserModel])
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.listUsers()
  }
}