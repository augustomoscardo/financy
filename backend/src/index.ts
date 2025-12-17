import { ApolloServer } from "@apollo/server"
import express from "express"
import { expressMiddleware } from "@as-integrations/express5"
import { buildSchema } from "type-graphql"
import cors from "cors"

const PORT = 4444

async function bootStrap() {
  const schema = await buildSchema({
    resolvers: [],
    validate: false,
    emitSchemaFile: "./schema.graphql"
  })

  const server = new ApolloServer({ schema })
  await server.start()

  const app = express()
  app.use(express.json())
  app.use(cors())

  app.use("/graphql", expressMiddleware(server))

  app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`))
}

bootStrap()

