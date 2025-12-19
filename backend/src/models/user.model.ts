import { ObjectType, Field, ID, GraphQLISODateTime } from "type-graphql"

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  password?: string | null | undefined;

  @Field(() => GraphQLISODateTime,)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}