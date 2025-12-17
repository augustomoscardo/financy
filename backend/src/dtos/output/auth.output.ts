import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class RegisterInput {
  @Field(() => String)
  token: string

  @Field(() => String)
  refreshToken: string

  @Field(() => UserModel)
  user: UserModel
}