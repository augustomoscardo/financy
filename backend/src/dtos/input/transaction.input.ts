import { TransactionType } from "@prisma/client";
import { Field, InputType, GraphQLISODateTime } from "type-graphql";


@InputType()
export class TransactionFilters {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Number)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  categoryId!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Number, { nullable: true })
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;
}