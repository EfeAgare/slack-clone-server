import { gql } from 'apollo-server-express';

export default gql`
  type Team {
    id: Int!
    name: String!
    owner: String!
    member: [Member!]!
    createdAt: String!
    updatedAt: String!
  }
`;
