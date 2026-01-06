import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { TransactionModel } from "./transaction.model";
import { UserModel } from "./user.model";


@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  color?: string | null;

  @Field(() => String, { nullable: true })
  icon?: string | null;

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[];

  @Field(() => String)
  userId!: string;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}