import { gql } from 'apollo-server-express';

export default gql`
  type Member {
    id: Int!
    workSpace: [WorkSpace!]!
    user: [User!]!
    createdAt: String!
    updatedAt: String!
  }
`;
