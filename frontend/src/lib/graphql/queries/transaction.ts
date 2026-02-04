import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
      id
      title
      amount
      type
      date
      categoryId
      category {
        id
        name
        icon
        color
      }
      createdAt
      updatedAt
    }
  }
`;
