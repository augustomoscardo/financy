import { ObjectType, Field, ID, GraphQLISODateTime } from "type-graphql"
import { CategoryModel } from "./category.model";
import { TransactionModel } from "./transaction.model";

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

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[];

  @Field(() => [CategoryModel], { nullable: true })
  categories?: CategoryModel[];

  @Field(() => GraphQLISODateTime,)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}