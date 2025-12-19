import "reflect-metadata"
import { ApolloServer } from "@apollo/server"
import express from "express"
import { expressMiddleware } from "@as-integrations/express5"
import { buildSchema } from "type-graphql"
import cors from "cors"
import { AuthResolver } from "./resolvers/auth.resolver"

const PORT = 3333

async function bootStrap() {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql"
  })

  const server = new ApolloServer({ schema })
  await server.start()

  const app = express()
  app.use(express.json())
  app.use(cors({ origin: "*" }))

  app.use("/graphql", expressMiddleware(server))

  app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`))
}

bootStrap()