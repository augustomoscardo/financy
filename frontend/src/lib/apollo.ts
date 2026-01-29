import { useAuthStore } from "@/stores/auth";
import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
});

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      if (message === "Usuário não autenticado.") {
        const { logout } = useAuthStore.getState();
        logout();
      }
    })
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) =>
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      )
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
