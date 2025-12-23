import type { MiddlewareFn } from "type-graphql";
import type { GraphQLContext } from "../graphql/context";

export const isAuth: MiddlewareFn<GraphQLContext> = async ({ context }, next) => {
  if (!context.user) {
    throw new Error("Usuário não autenticado.");
  }

  return next()
}