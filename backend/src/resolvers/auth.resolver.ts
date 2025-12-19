import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { LoginOutput, RegisterOutput } from '../dtos/output/auth.output';
import { LoginInput, RegisterInput } from '../dtos/input/auth.input';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Query(() => String)
  hello(): string {
    return "Hello World!"
  }

  @Mutation(() => RegisterOutput)
  async register(@Arg("data", () => RegisterInput) data: RegisterInput): Promise<RegisterOutput> {
    return this.authService.register(data)
  }

  // @Mutation(() => LoginOutput)
  // async login(@Arg("data", () => LoginInput) data: LoginInput): Promise<LoginOutput> {
  //   return this.authService
  // }
}