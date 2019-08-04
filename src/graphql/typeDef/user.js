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
`;
