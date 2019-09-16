import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    channel: [Channel!]!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }

  extend type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      token: String
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }
`;
