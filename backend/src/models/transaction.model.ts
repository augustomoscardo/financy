import { Field, Float, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "type-graphql";
import { UserModel } from "./user.model";
import { CategoryModel } from "./category.model";

export enum TransactionType {
  income = "income",
  outcome = "outcome",
}

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Type of transaction: income or outcome",
})


@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  categoryId!: string;

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel;

  @Field(() => String)
  userId!: string;

  @Field(() => UserModel, { nullable: true })
  user?: UserModel;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}