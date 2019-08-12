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

  extend type Mutation {
    register(username: String!, email:String!, password: String!): User!
  }
`;
 