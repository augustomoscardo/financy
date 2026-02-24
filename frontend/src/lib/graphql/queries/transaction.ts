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

export const GET_TRANSACTIONS_PAGINATED = gql`
  query GetTransactionsPaginated(
    $page: Int!
    $limit: Int!
    $filters: TransactionFilters
  ) {
    getTransactionsPaginated(page: $page, limit: $limit, filters: $filters) {
      transactions {
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
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
