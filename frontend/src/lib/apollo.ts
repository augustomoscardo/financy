import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

// import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
});

// const authLink = new SetContextLink(() => {})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
});
