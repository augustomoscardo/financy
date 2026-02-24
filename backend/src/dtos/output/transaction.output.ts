import { Field, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field(() => Int)
  totalItems!: number;

  @Field(() => Int)
  itemsPerPage!: number;

  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field(() => Boolean)
  hasPreviousPage!: boolean;
}

@ObjectType()
export class TransactionConnection {
  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];

  @Field(() => PaginationInfo)
  pagination!: PaginationInfo;
}
