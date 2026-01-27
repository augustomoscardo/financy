import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
    }
  }
`