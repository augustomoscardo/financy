import { createParameterDecorator, type ResolverData } from "type-graphql"
import { GraphQLContext } from "../context"
import { User } from "@prisma/client"
import { prismaClient } from "../../lib/prisma"


export const GqlUser = () => {
  return createParameterDecorator(async ({ context }: ResolverData<GraphQLContext>): Promise<User | null> => {
    if (!context || !context.user) return null

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          id: context.user
        }
      })

      if (!user) throw new Error("User not found in GqlUser decorator")

      return user
    } catch (error) {
      console.log("Error fetching user in GqlUser decorator:", error);

      return null
    }
  })
}